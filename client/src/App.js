import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// CHANGE THIS TO YOUR RENDER URL BEFORE SUBMITTING (e.g., https://your-app.onrender.com/contacts)
const API_URL = 'http://localhost:5000/contacts';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  // 1. Fetch Contacts
  useEffect(() => {
    axios.get(API_URL).then(res => setContacts(res.data));
  }, []);

  // 2. Add Contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, form);
      setContacts([res.data, ...contacts]); // Add new contact to top
      setForm({ name: '', email: '', phone: '' }); // Clear form
    } catch (err) {
      alert("Error adding contact");
    }
  };

  // 3. Delete Contact (The X Button Logic)
  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      alert("Error deleting contact");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Contact Manager</h1>
      
      <div className="main-layout">
        {/* LEFT SIDE: FORM */}
        <div className="form-section">
          <h2>Add New Contact</h2>
          <form onSubmit={handleSubmit}>
            <input 
              placeholder="Name" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
            <input 
              placeholder="Email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
            <input 
              placeholder="Phone" 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
              required 
            />
            <button type="submit" className="save-btn">Save Contact</button>
          </form>
        </div>

        {/* RIGHT SIDE: LIST */}
        <div className="list-section">
          <h2>Contacts Directory</h2>
          <div className="scroll-list">
            {contacts.map(c => (
              <div key={c._id} className="contact-card">
                <div className="card-info">
                  <h3>{c.name}</h3>
                  <p>{c.email}</p>
                  <p>{c.phone}</p>
                </div>
                {/* THE X BUTTON */}
                <button onClick={() => deleteContact(c._id)} className="delete-btn">
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;