import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://contact-manager-5ug0.onrender.com/contacts';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({}); // Stores error messages
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch contacts on load
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Real-time Validation Function
  const validate = (name, value) => {
    let errorMsg = '';
    
    if (name === 'name' && !value.trim()) {
      errorMsg = 'Name is required';
    }
    if (name === 'phone' && !value.trim()) {
      errorMsg = 'Phone is required';
    }
    if (name === 'email') {
      if (!value.trim()) {
        errorMsg = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errorMsg = 'Invalid email format';
      }
    }
    return errorMsg;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate immediately as user types
    const error = validate(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // Check if form is valid (to enable/disable button)
  const isFormValid = 
    formData.name && 
    formData.email && 
    formData.phone && 
    !errors.name && 
    !errors.email && 
    !errors.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form
      fetchContacts(); // Refresh list
    } catch (error) {
      console.error('Error adding contact:', error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="App">
      <h1>Contact Manager</h1>
      
      <div className="container">
        {/* Contact Form */}
        <div className="form-card">
          <h2>Add Contact</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <textarea
              name="message"
              placeholder="Message (Optional)"
              value={formData.message}
              onChange={handleChange}
            />

            <button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              className={!isFormValid ? 'disabled-btn' : ''}
            >
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </button>
          </form>
        </div>

        {/* Contact List */}
        <div className="list-card">
          <h2>Contacts</h2>
          {contacts.length === 0 ? <p>No contacts found.</p> : (
            <div className="contact-grid">
              {contacts.map((contact) => (
                <div key={contact._id} className="contact-item">
                  <div className="contact-info">
                    <h3>{contact.name}</h3>
                    <p>{contact.email}</p>
                    <p>{contact.phone}</p>
                    {contact.message && <small>{contact.message}</small>}
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(contact._id)}>X</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;