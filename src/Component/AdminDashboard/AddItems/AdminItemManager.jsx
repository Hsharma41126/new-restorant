import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { PlusCircle, Save } from 'react-bootstrap-icons';

const AddItemPage = () => {
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [types, setTypes] = useState([]);
  const [printer, setPrinter] = useState('');

  const categories = ['Food', 'Drink', 'Games'];
  const subcategories = {
    Food: ['Pizza', 'Burger', 'Pasta', 'Sandwich'],
    Drink: ['Cold Drink', 'Juice', 'Coffee', 'Tea'],
    Games: ['Pool', 'Carrom', 'Chess', 'Cards']
  };

  const printers = ['Kitchen Printer', 'Bar Printer', 'Main Printer', 'Game Zone Printer'];

  const defaultTypes = {
    Pizza: [
      { name: 'Cheese Pizza', price: '250' },
      { name: 'Veg Pizza', price: '200' },
      { name: 'Paneer Pizza', price: '300' }
    ],
    Burger: [
      { name: 'Aloo Tikki', price: '80' },
      { name: 'Chicken Burger', price: '150' }
    ],
    'Cold Drink': [
      { name: 'Pepsi', price: '40' },
      { name: 'Coke', price: '40' }
    ],
    Pool: [
      { name: '8 Ball', price: '100' },
      { name: '9 Ball', price: '120' }
    ]
  };

  const handleAddType = () => {
    setTypes([...types, { name: '', price: '' }]);
  };

  const handleRemoveType = (index) => {
    const updatedTypes = [...types];
    updatedTypes.splice(index, 1);
    setTypes(updatedTypes);
  };

  const handleTypeChange = (index, field, value) => {
    const updatedTypes = [...types];
    updatedTypes[index][field] = value;
    setTypes(updatedTypes);
  };

  useEffect(() => {
    if (subcategory && subcategory !== 'new') {
      const existingTypes = defaultTypes[subcategory] || [{ name: '', price: '' }];
      setTypes(existingTypes);
      
      if (['Pizza', 'Burger', 'Pasta'].includes(subcategory)) {
        setPrinter('Kitchen Printer');
      } else if (['Cold Drink', 'Juice'].includes(subcategory)) {
        setPrinter('Bar Printer');
      } else if (['Pool', 'Carrom'].includes(subcategory)) {
        setPrinter('Game Zone Printer');
      } else {
        setPrinter('Main Printer');
      }
    }
    if (subcategory === 'new') {
      setTypes([{ name: '', price: '' }]);
      setPrinter('Main Printer');
    }
  }, [subcategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = category === 'new' ? newCategory : category;
    const finalSubcategory = subcategory === 'new' ? newSubcategory : subcategory;
    console.log({ finalCategory, finalSubcategory, types, printer });
    alert('Item saved successfully!');
    setCategory('');
    setNewCategory('');
    setSubcategory('');
    setNewSubcategory('');
    setTypes([]);
    setPrinter('');
  };

  return (
    <div className="p-2">
      <div className="mb-3">
        <h5 className="mb-0">Add New Menu Item</h5>
      </div>
      <Card className="shadow-sm">
        <Card.Body className="p-3">
          <Form onSubmit={handleSubmit}>
            {/* Category Section */}
            <Card className="mb-3">
              <Card.Header className="bg-light p-2">
                <h6 className="mb-0">Category Information</h6>
              </Card.Header>
              <Card.Body className="p-2">
                <Form.Group className="mb-2">
                  <Form.Label className="small">Select Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory('');
                    }}
                    size="sm"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="new">+ Add New Category</option>
                  </Form.Select>
                </Form.Group>

                {category === 'new' && (
                  <Form.Group className="mb-2">
                    <Form.Label className="small">New Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category name"
                      size="sm"
                      required
                    />
                  </Form.Group>
                )}
              </Card.Body>
            </Card>

            {/* Subcategory Section */}
            {category && (
              <Card className="mb-3">
                <Card.Header className="bg-light p-2">
                  <h6 className="mb-0">Subcategory Information</h6>
                </Card.Header>
                <Card.Body className="p-2">
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Select Subcategory</Form.Label>
                    <Form.Select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      size="sm"
                      disabled={!category}
                    >
                      <option value="">-- Select Subcategory --</option>
                      {(subcategories[category] || []).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value="new">+ Add New Subcategory</option>
                    </Form.Select>
                  </Form.Group>

                  {subcategory === 'new' && (
                    <Form.Group className="mb-2">
                      <Form.Label className="small">New Subcategory Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        placeholder="Enter new subcategory name"
                        size="sm"
                        required
                      />
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Printer Selection Section */}
            {subcategory && (
              <Card className="mb-3">
                <Card.Header className="bg-light p-2">
                  <h6 className="mb-0">Printer Selection</h6>
                </Card.Header>
                <Card.Body className="p-2">
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Select Printer</Form.Label>
                    <Form.Select
                      value={printer}
                      onChange={(e) => setPrinter(e.target.value)}
                      size="sm"
                      required
                    >
                      <option value="">-- Select Printer --</option>
                      {printers.map((printerOption) => (
                        <option key={printerOption} value={printerOption}>
                          {printerOption}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Card.Body>
              </Card>
            )}

            {/* Types and Prices Section */}
            {subcategory && (
              <Card className="mb-3">
                <Card.Header className="bg-light p-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Item Types and Prices</h6>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={handleAddType}
                      className="py-0"
                    >
                      <PlusCircle size={14} className="me-1" /> Add
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-2">
                  {types.length === 0 ? (
                    <div className="text-center py-2 text-muted small">
                      No types added yet. Click "Add" to get started.
                    </div>
                  ) : (
                    types.map((type, index) => (
                      <Row key={index} className="mb-2 g-2 align-items-center">
                        <Col md={6}>
                          <Form.Control
                            type="text"
                            value={type.name}
                            placeholder="Item name"
                            onChange={(e) => handleTypeChange(index, 'name', e.target.value)}
                            size="sm"
                            required
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            type="number"
                            value={type.price}
                            placeholder="Price (₹)"
                            onChange={(e) => handleTypeChange(index, 'price', e.target.value)}
                            size="sm"
                            required
                          />
                        </Col>
                        <Col md={2}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveType(index)}
                            className="w-100 py-0"
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    ))
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Submit Button */}
            <div className="text-center mt-3">
              <Button
                variant="warning"
                type="submit"
                size="sm"
                disabled={!category || !subcategory || types.length === 0 || !printer}
                className="px-4"
              >
                <Save size={14} className="me-1" /> Save Item
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddItemPage;