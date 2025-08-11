const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');
const { pool } = require('../config/database');
const moment = require('moment');

class PrinterService {
  constructor() {
    this.printers = new Map();
  }

  // Initialize printer connection
  async initializePrinter(printerId) {
    try {
      const [printers] = await pool.execute(
        'SELECT * FROM printers WHERE id = ? AND is_active = TRUE',
        [printerId]
      );

      if (printers.length === 0) {
        throw new Error('Printer not found or inactive');
      }

      const printerConfig = printers[0];
      
      const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: `tcp://${printerConfig.ip_address}:${printerConfig.port}`,
        characterSet: CharacterSet.PC852_LATIN2,
        removeSpecialCharacters: false,
        lineCharacter: "=",
        breakLine: BreakLine.WORD,
        options: {
          timeout: 5000
        }
      });

      this.printers.set(printerId, { printer, config: printerConfig });
      return printer;
    } catch (error) {
      console.error('Printer initialization failed:', error);
      throw error;
    }
  }

  // Test printer connection
  async testPrinter(printerId) {
    try {
      const printer = await this.initializePrinter(printerId);
      
      printer.alignCenter();
      printer.println("=".repeat(32));
      printer.setTextSize(1, 1);
      printer.println("PRINTER TEST");
      printer.println("=".repeat(32));
      printer.println("");
      printer.alignLeft();
      printer.println(`Test Time: ${moment().format('DD/MM/YYYY HH:mm:ss')}`);
      printer.println("Printer is working correctly!");
      printer.println("");
      printer.println("=".repeat(32));
      printer.cut();

      const isConnected = await printer.isPrinterConnected();
      if (isConnected) {
        await printer.execute();
        
        // Update last test print time
        await pool.execute(
          'UPDATE printers SET last_test_print = NOW(), is_online = TRUE WHERE id = ?',
          [printerId]
        );
        
        return { success: true, message: 'Test print successful' };
      } else {
        throw new Error('Printer not connected');
      }
    } catch (error) {
      // Update printer status to offline
      await pool.execute(
        'UPDATE printers SET is_online = FALSE WHERE id = ?',
        [printerId]
      );
      
      throw new Error(`Test print failed: ${error.message}`);
    }
  }

  // Print KOT (Kitchen Order Ticket)
  async printKOT(kotId) {
    try {
      // Get KOT details with order and items
      const [kotData] = await pool.execute(`
        SELECT 
          k.*,
          o.order_number,
          o.table_id,
          o.customer_name,
          o.order_type,
          o.special_instructions as order_instructions,
          rt.table_number,
          rt.table_name,
          rt.location
        FROM kots k
        JOIN orders o ON k.order_id = o.id
        LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
        WHERE k.id = ?
      `, [kotId]);

      if (kotData.length === 0) {
        throw new Error('KOT not found');
      }

      const kot = kotData[0];

      // Get KOT items
      const [kotItems] = await pool.execute(`
        SELECT 
          ki.*,
          mi.name as item_name,
          mi.preparation_time
        FROM kot_items ki
        JOIN order_items oi ON ki.order_item_id = oi.id
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE ki.kot_id = ?
        ORDER BY ki.id
      `, [kotId]);

      // Find appropriate printer based on category
      const [printers] = await pool.execute(`
        SELECT p.* FROM printers p
        JOIN printer_category_mappings pcm ON p.id = pcm.printer_id
        JOIN subcategories sc ON pcm.subcategory_id = sc.id
        JOIN menu_items mi ON sc.id = mi.subcategory_id
        JOIN order_items oi ON mi.id = oi.menu_item_id
        JOIN kot_items ki ON oi.id = ki.order_item_id
        WHERE ki.kot_id = ? AND p.is_active = TRUE AND p.is_online = TRUE
        LIMIT 1
      `, [kotId]);

      let printerId;
      if (printers.length > 0) {
        printerId = printers[0].id;
      } else {
        // Fallback to default kitchen printer
        const [defaultPrinters] = await pool.execute(
          'SELECT id FROM printers WHERE type = "Kitchen" AND is_active = TRUE AND is_online = TRUE LIMIT 1'
        );
        if (defaultPrinters.length === 0) {
          throw new Error('No active kitchen printer found');
        }
        printerId = defaultPrinters[0].id;
      }

      const printer = await this.initializePrinter(printerId);

      // Format and print KOT
      printer.alignCenter();
      printer.setTextSize(1, 1);
      printer.bold(true);
      printer.println("KITCHEN ORDER TICKET");
      printer.bold(false);
      printer.println("=".repeat(32));
      printer.println("");

      printer.alignLeft();
      printer.setTextSize(0, 0);
      printer.bold(true);
      printer.println(`KOT #: ${kot.kot_number}`);
      printer.println(`Order #: ${kot.order_number}`);
      printer.bold(false);
      printer.println(`Date: ${moment(kot.created_at).format('DD/MM/YYYY')}`);
      printer.println(`Time: ${moment(kot.created_at).format('HH:mm:ss')}`);
      printer.println("");

      if (kot.table_number) {
        printer.bold(true);
        printer.println(`Table: ${kot.table_number}`);
        if (kot.table_name) printer.println(`(${kot.table_name})`);
        if (kot.location) printer.println(`Location: ${kot.location}`);
        printer.bold(false);
        printer.println("");
      }

      if (kot.customer_name) {
        printer.println(`Customer: ${kot.customer_name}`);
        printer.println("");
      }

      printer.bold(true);
      printer.println(`Order Type: ${kot.order_type}`);
      printer.bold(false);
      printer.println("");

      printer.println("=".repeat(32));
      printer.bold(true);
      printer.println("ITEMS TO PREPARE:");
      printer.bold(false);
      printer.println("=".repeat(32));

      kotItems.forEach((item, index) => {
        printer.println("");
        printer.bold(true);
        printer.setTextSize(0, 1);
        printer.println(`${index + 1}. ${item.menu_item_name}`);
        printer.bold(false);
        printer.setTextSize(0, 0);
        printer.println(`   Qty: ${item.quantity}`);
        
        if (item.special_instructions) {
          printer.println(`   Note: ${item.special_instructions}`);
        }
        
        if (item.preparation_time) {
          printer.println(`   Prep Time: ${item.preparation_time} min`);
        }
      });

      printer.println("");
      printer.println("=".repeat(32));

      if (kot.order_instructions) {
        printer.bold(true);
        printer.println("SPECIAL INSTRUCTIONS:");
        printer.bold(false);
        printer.println(kot.order_instructions);
        printer.println("=".repeat(32));
      }

      printer.println("");
      printer.alignCenter();
      printer.println("Please prepare items as ordered");
      printer.println("Mark as ready when complete");
      printer.println("");
      printer.println("=".repeat(32));
      
      // Add space for cutting/sticking
      printer.println("");
      printer.println("");
      printer.cut();

      const isConnected = await printer.isPrinterConnected();
      if (isConnected) {
        await printer.execute();
        
        // Update KOT status
        await pool.execute(
          'UPDATE kots SET status = "Printed", printed_at = NOW() WHERE id = ?',
          [kotId]
        );
        
        return { success: true, message: 'KOT printed successfully', printerId };
      } else {
        throw new Error('Printer not connected');
      }
    } catch (error) {
      console.error('KOT printing failed:', error);
      throw error;
    }
  }

  // Print receipt
  async printReceipt(orderId) {
    try {
      // Get order details
      const [orderData] = await pool.execute(`
        SELECT 
          o.*,
          rt.table_number,
          rt.table_name,
          s.session_id,
          s.start_time,
          s.end_time,
          s.duration_minutes,
          s.hourly_rate
        FROM orders o
        LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
        LEFT JOIN sessions s ON o.session_id = s.id
        WHERE o.id = ?
      `, [orderId]);

      if (orderData.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderData[0];

      // Get order items
      const [orderItems] = await pool.execute(`
        SELECT 
          oi.*,
          mi.name as item_name
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
        ORDER BY oi.id
      `, [orderId]);

      // Get receipt printer
      const [printers] = await pool.execute(
        'SELECT * FROM printers WHERE type = "Receipt" AND is_active = TRUE AND is_online = TRUE LIMIT 1'
      );

      if (printers.length === 0) {
        throw new Error('No active receipt printer found');
      }

      const printer = await this.initializePrinter(printers[0].id);

      // Get business settings
      const [settings] = await pool.execute(
        'SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ("business_name", "business_address", "business_phone", "receipt_footer")'
      );

      const businessSettings = {};
      settings.forEach(setting => {
        businessSettings[setting.setting_key] = setting.setting_value;
      });

      // Print receipt header
      printer.alignCenter();
      printer.setTextSize(1, 1);
      printer.bold(true);
      printer.println(businessSettings.business_name || "Restaurant POS");
      printer.bold(false);
      printer.setTextSize(0, 0);
      if (businessSettings.business_address) {
        printer.println(businessSettings.business_address);
      }
      if (businessSettings.business_phone) {
        printer.println(`Tel: ${businessSettings.business_phone}`);
      }
      printer.println("=".repeat(32));
      printer.println("");

      printer.alignLeft();
      printer.println(`Receipt #: ${order.order_number}`);
      printer.println(`Date: ${moment(order.created_at).format('DD/MM/YYYY HH:mm:ss')}`);
      
      if (order.table_number) {
        printer.println(`Table: ${order.table_number}`);
      }
      
      if (order.customer_name) {
        printer.println(`Customer: ${order.customer_name}`);
      }

      printer.println(`Order Type: ${order.order_type}`);
      printer.println("");

      // Session details if applicable
      if (order.session_id) {
        printer.println("=".repeat(32));
        printer.bold(true);
        printer.println("SESSION CHARGES:");
        printer.bold(false);
        printer.println(`Session ID: ${order.session_id}`);
        printer.println(`Start: ${moment(order.start_time).format('HH:mm:ss')}`);
        if (order.end_time) {
          printer.println(`End: ${moment(order.end_time).format('HH:mm:ss')}`);
        }
        printer.println(`Duration: ${order.duration_minutes} minutes`);
        printer.println(`Rate: $${order.hourly_rate}/hour`);
        printer.println("");
      }

      // Order items
      if (orderItems.length > 0) {
        printer.println("=".repeat(32));
        printer.bold(true);
        printer.println("ORDER ITEMS:");
        printer.bold(false);
        
        orderItems.forEach(item => {
          printer.println(`${item.item_name}`);
          printer.println(`  ${item.quantity} x $${item.unit_price} = $${item.total_price}`);
        });
        printer.println("");
      }

      // Totals
      printer.println("=".repeat(32));
      printer.println(`Subtotal:        $${order.subtotal}`);
      printer.println(`Tax:             $${order.tax_amount}`);
      if (order.discount_amount > 0) {
        printer.println(`Discount:       -$${order.discount_amount}`);
      }
      printer.bold(true);
      printer.println(`TOTAL:           $${order.total_amount}`);
      printer.bold(false);
      printer.println("=".repeat(32));
      printer.println("");

      printer.alignCenter();
      if (businessSettings.receipt_footer) {
        printer.println(businessSettings.receipt_footer);
      }
      printer.println("Thank you for your visit!");
      printer.println("");
      printer.cut();

      const isConnected = await printer.isPrinterConnected();
      if (isConnected) {
        await printer.execute();
        return { success: true, message: 'Receipt printed successfully' };
      } else {
        throw new Error('Receipt printer not connected');
      }
    } catch (error) {
      console.error('Receipt printing failed:', error);
      throw error;
    }
  }
}

module.exports = new PrinterService();