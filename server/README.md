# Restaurant POS Backend with KOT System

A complete Node.js backend for a restaurant POS system with integrated Kitchen Order Ticket (KOT) printing functionality.

## Features

### Core POS Features
- **User Management**: Admin, Staff, Manager, and Customer roles
- **Menu Management**: Categories, subcategories, and menu items
- **Order Management**: Complete order lifecycle management
- **Table Management**: Restaurant tables, gaming tables, and reservations
- **Session Tracking**: For gaming tables with time-based billing
- **Payment Processing**: Multiple payment methods support

### KOT System Features
- **Automatic KOT Generation**: Creates KOTs when orders are placed
- **Smart Printer Routing**: Routes orders to appropriate printers based on category
- **Thermal Printer Support**: ESC/POS compatible thermal printers
- **Kitchen Display**: Real-time KOT status tracking
- **Print Management**: Test printing, status monitoring, and manual reprinting

### Printer Management
- **Multiple Printer Support**: Kitchen, Bar, Receipt, and General printers
- **Wi-Fi Printer Integration**: Network-based thermal printers
- **Category Mapping**: Route specific menu categories to designated printers
- **Status Monitoring**: Real-time printer connectivity status
- **Test Printing**: Built-in printer testing functionality

## Installation

1. **Clone and Setup**
```bash
cd server
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your database and configuration details
```

3. **Database Setup**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE restaurant_pos;
exit

# Run migrations
npm run migrate
```

4. **Start Server**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Menu Management
- `GET /api/menu/categories` - Get all categories with items
- `POST /api/menu/categories` - Create category
- `POST /api/menu/subcategories` - Create subcategory
- `POST /api/menu/items` - Create menu item
- `PUT /api/menu/items/:id` - Update menu item
- `DELETE /api/menu/items/:id` - Delete menu item

### Order Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/print-kot` - Print KOT for order
- `POST /api/orders/:id/print-receipt` - Print receipt

### KOT Management
- `GET /api/kots` - Get all KOTs
- `GET /api/kots/:id` - Get single KOT
- `PUT /api/kots/:id/status` - Update KOT status
- `PUT /api/kots/:kotId/items/:itemId/status` - Update KOT item status
- `POST /api/kots/:id/print` - Print KOT
- `GET /api/kots/stats/summary` - Get KOT statistics

### Printer Management
- `GET /api/printers` - Get all printers
- `GET /api/printers/:id` - Get single printer
- `POST /api/printers` - Add new printer
- `PUT /api/printers/:id` - Update printer
- `DELETE /api/printers/:id` - Delete printer
- `POST /api/printers/:id/test` - Test printer
- `GET /api/printers/:id/status` - Check printer status

## Database Schema

### Key Tables
- **users**: User accounts and roles
- **categories/subcategories**: Menu organization
- **menu_items**: Menu items with pricing
- **restaurant_tables**: Table management
- **orders**: Order records
- **order_items**: Individual order items
- **kots**: Kitchen Order Tickets
- **kot_items**: KOT line items
- **printers**: Printer configuration
- **printer_category_mappings**: Category-to-printer routing

## KOT Printing System

### How It Works
1. **Order Creation**: When an order is placed, a KOT is automatically generated
2. **Category Detection**: System determines if order contains Food, Beverages, or Mixed items
3. **Printer Selection**: Routes KOT to appropriate printer based on category mappings
4. **Print Formatting**: Formats KOT for thermal printers with clear, kitchen-friendly layout
5. **Status Tracking**: Tracks KOT status from Pending → Printed → Preparing → Ready → Served

### KOT Format
```
================================
       KITCHEN ORDER TICKET
================================

KOT #: KOT-2025-0119-1234
Order #: ORD-2025-0119-5678
Date: 19/01/2025
Time: 14:30:25

Table: 12
(Premium Gaming Table)
Location: Gaming Zone

Customer: John Doe

Order Type: Dine-in

================================
      ITEMS TO PREPARE:
================================

1. Margherita Pizza
   Qty: 2
   Note: Extra cheese
   Prep Time: 15 min

2. Chicken Wings
   Qty: 1
   Note: Spicy sauce
   Prep Time: 12 min

================================
SPECIAL INSTRUCTIONS:
Customer is allergic to nuts
================================

Please prepare items as ordered
Mark as ready when complete

================================
```

### Printer Setup

1. **Add Printer**
```javascript
POST /api/printers
{
  "name": "Kitchen Printer 1",
  "type": "Kitchen",
  "ip_address": "192.168.1.100",
  "port": 9100,
  "paper_size": "80mm",
  "category_mappings": [
    {
      "category_id": 1,  // Food category
      "subcategory_id": 1 // Pizza subcategory
    }
  ]
}
```

2. **Test Printer**
```javascript
POST /api/printers/1/test
// Prints a test receipt to verify connectivity
```

## Configuration

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=restaurant_pos
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development

# Printer
DEFAULT_PRINTER_IP=192.168.1.100
DEFAULT_PRINTER_PORT=9100
```

### System Settings
The system includes configurable settings stored in the database:
- Tax rate percentage
- Service charge amount
- Business information for receipts
- Auto-print KOT setting
- Receipt footer message

## Printer Requirements

### Supported Printers
- ESC/POS compatible thermal printers
- Network-enabled (Wi-Fi/Ethernet)
- 58mm or 80mm paper width
- Common brands: Epson, Star, Citizen, Bixolon

### Network Setup
1. Connect printer to same network as POS system
2. Configure printer with static IP address
3. Test connectivity using printer's web interface
4. Add printer to system using IP address and port

## Usage Examples

### Creating an Order with Auto-KOT
```javascript
// Create order
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    table_id: 12,
    customer_name: 'John Doe',
    order_type: 'Dine-in',
    items: [
      {
        menu_item_id: 1,
        quantity: 2,
        special_instructions: 'Extra cheese'
      },
      {
        menu_item_id: 5,
        quantity: 1,
        special_instructions: 'Spicy sauce'
      }
    ],
    special_instructions: 'Customer is allergic to nuts'
  })
});

// KOT is automatically created and printed (if auto-print is enabled)
```

### Manual KOT Printing
```javascript
// Print KOT for existing order
const result = await fetch('/api/orders/123/print-kot', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

### Kitchen Status Updates
```javascript
// Update KOT status
await fetch('/api/kots/456/status', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'Ready'
  })
});
```

## Troubleshooting

### Common Issues

1. **Printer Not Found**
   - Check IP address and port
   - Verify printer is on same network
   - Test printer connectivity

2. **KOT Not Printing**
   - Check printer status: `GET /api/printers/:id/status`
   - Verify category mappings
   - Check auto-print setting

3. **Database Connection Issues**
   - Verify MySQL is running
   - Check database credentials in .env
   - Ensure database exists

### Logs
The system provides detailed logging for:
- Order creation and KOT generation
- Printer connectivity and status
- Print job success/failure
- Database operations

## Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation
- SQL injection prevention
- CORS configuration
- Helmet security headers

## Development

### Adding New Features
1. Create new route files in `/routes`
2. Add database migrations in `/migrations`
3. Update API documentation
4. Add tests for new endpoints

### Database Migrations
```bash
# Create new migration
touch migrations/002_new_feature.sql

# Run migrations
npm run migrate
```

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check printer compatibility
4. Verify network configuration

## License

This project is licensed under the MIT License.