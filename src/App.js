import React, { useState, useEffect } from 'react';
import './App.css';

const mockApiResponses = {
  userInfo: {
    fields: [
      { name: 'firstName', type: 'text', label: 'First Name', required: true },
      { name: 'lastName', type: 'text', label: 'Last Name', required: true },
      { name: 'age', type: 'number', label: 'Age', required: false },
    ],
  },
  addressInfo: {
    fields: [
      { name: 'street', type: 'text', label: 'Street', required: true },
      { name: 'city', type: 'text', label: 'City', required: true },
      { name: 'state', type: 'dropdown', label: 'State', options: ['California', 'Texas', 'New York'], required: true },
      { name: 'zipCode', type: 'text', label: 'Zip Code', required: false },
    ],
  },
  paymentInfo: {
    fields: [
      { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
      { name: 'cvv', type: 'password', label: 'CVV', required: true },
      { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
    ],
  },
};

function App() {
  const [formType, setFormType] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (formType) {
      const fields = mockApiResponses[formType]?.fields || [];
      setFormFields(fields);
      setFormData({});
      setProgress(0);
    }
  }, [formType]);

  const handleInputChange = (e, fieldName) => {
    const updatedData = { ...formData, [fieldName]: e.target.value };
    setFormData(updatedData);

    const requiredFields = formFields.filter((field) => field.required);
    const completedFields = requiredFields.filter((field) => updatedData[field.name]);
    setProgress((completedFields.length / requiredFields.length) * 100 || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData((prev) => [...prev, formData]);
    setFormType('');
    alert('Form submitted successfully!');
  };

  const handleDelete = (index) => {
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    alert('Entry deleted successfully.');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dynamic Form</h1>
      </header>
      <main>
        <div className="form-selector">
          <label>Select Form Type:</label>
          <select onChange={(e) => setFormType(e.target.value)} value={formType}>
            <option value="">-- Choose --</option>
            <option value="userInfo">User Information</option>
            <option value="addressInfo">Address Information</option>
            <option value="paymentInfo">Payment Information</option>
          </select>
        </div>

        {formType && (
          <form onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className="form-group">
                <label>
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'dropdown' ? (
                  <select
                    onChange={(e) => handleInputChange(e, field.name)}
                    required={field.required}
                  >
                    <option value="">-- Select --</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    onChange={(e) => handleInputChange(e, field.name)}
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }}>{progress.toFixed(0)}%</div>
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        {submittedData.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(submittedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <footer className="App-footer">
        <p>Dynamic Form Application &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;
