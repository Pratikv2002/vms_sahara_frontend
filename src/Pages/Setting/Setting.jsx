import React, { useEffect, useState } from 'react';
import axios from '../../authAxios.js'; // Import Axios
import { Trash2, Edit2, Plus } from 'lucide-react';
import './VisitorTypeSettings.css'; // Import the CSS file

// Base URL for your API - Assuming this is defined globally or passed via context/env
// For demonstration, I'll use a placeholder. Replace 'YOUR_BASE_API_URL' with your actual base URL.
// Example: const API_BASE_URL = 'http://localhost:3000/api';
// You mentioned "dont add base url i have already defined it", so ensure this is set up correctly in your environment.
// For the purpose of making this code runnable for you, I'll use a placeholder.
const API_BASE_URL = 'https://api.example.com'; // **REPLACE THIS WITH YOUR ACTUAL BASE URL**

// Simple Switch component using button and plain CSS
const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`switch-button ${checked ? 'checked' : 'unchecked'}`}
  >
    <span className="switch-slider" />
  </button>
);

// Simple Button component using plain CSS
const Button = ({ children, onClick, size = 'md', variant = 'default', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'button-sm',
    md: 'button-md',
    icon: 'button-icon',
  };
  const variantClasses = {
    default: 'button-default',
    destructive: 'button-destructive',
    outline: 'button-outline',
    green: 'button-green',
  };

  return (
    <button
      onClick={onClick}
      className={`button-base ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Input component using plain CSS
const Input = ({ value, onChange, placeholder, className = '', ...props }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`input-field ${className}`}
    {...props}
  />
);

// Simple Dialog component (basic modal) using plain CSS
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="dialog-overlay"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="dialog-content"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Dialog subcomponents
const DialogHeader = ({ children }) => <div className="dialog-header">{children}</div>;
const DialogTitle = ({ children }) => <h3 className="dialog-title">{children}</h3>;
const DialogContent = ({ children }) => <div className="dialog-content-inner">{children}</div>;
const DialogFooter = ({ children }) => <div className="dialog-footer">{children}</div>;

// DialogTrigger just a wrapper to render children that triggers dialog open
const DialogTrigger = ({ children, onClick }) =>
  React.cloneElement(children, {
    onClick: () => onClick && onClick(),
  });

const VisitorTypeSettings = () => {
  const [visitorTypes, setVisitorTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false); // State to control the dialog visibility

  // Function to fetch visitor types from the API
  const fetchVisitorTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/get-visitor-types`);
      // Assuming the response structure is { status: 1, data: { results: [...] } }
      if (response.data.status === 1 && response.data.data && response.data.data.results) {
        setVisitorTypes(response.data.data.results.map(vt => ({
          ...vt,
          is_active: vt.is_active === 1 // Convert 1 to true, 0 to false
        })));
      } else {
        console.error("API response format error:", response.data);
        setVisitorTypes([]);
      }
    } catch (error) {
      console.error("Failed to fetch visitor types:", error);
      // In a real app, you'd show a user-friendly error message
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding or updating a visitor type
  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      // Basic validation: prevent empty names
      console.warn("Visitor type name cannot be empty.");
      return;
    }
    try {
      if (editingId) {
        // Update existing visitor type
        await axios.put(`/update-visitor-type/${editingId}`, { name });
      } else {
        // Add new visitor type
        await axios.post(`/add-visitor-type`, { name });
      }
      setName(''); // Clear input field
      setEditingId(null); // Reset editing state
      setOpen(false); // Close the dialog
      fetchVisitorTypes(); // Refresh the list
    } catch (error) {
      console.error("Failed to add/update visitor type:", error);
      // Handle specific API errors (e.g., duplicate name) here
    }
  };

  // Function to handle deleting a visitor type
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this visitor type?")) { // Simple confirmation
      try {
        await axios.delete(`/delete-visitor-type/${id}`);
        fetchVisitorTypes(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete visitor type:", error);
      }
    }
  };

  // Function to handle toggling the active status of a visitor type
  const handleToggleActive = async (id, currentIsActive) => {
    try {
      if (currentIsActive) {
        await axios.patch(`/deactivate-visitor-type/${id}`);
      } else {
        await axios.patch(`/activate-visitor-type/${id}`);
      }
      fetchVisitorTypes(); // Refresh the list
    } catch (error) {
      console.error("Failed to toggle visitor type status:", error);
    }
  };

  // Function to set the form for editing
  const handleEdit = (vt) => {
    setName(vt.name); // Populate input with current name
    setEditingId(vt.id); // Set the ID of the item being edited
    setOpen(true); // Open the dialog
  };

  // Effect hook to fetch visitor types on component mount
  useEffect(() => {
    fetchVisitorTypes();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="visitor-type-settings-container">
      {/* Header section with title and Add button */}
      <div className="visitor-type-settings-header">
        <h2>Visitor Types</h2>
        <DialogTrigger
          onClick={() => {
            setOpen(true); // Open dialog
            setName(''); // Clear name for new entry
            setEditingId(null); // Ensure no ID is set for new entry
          }}
        >
          <Button size="sm" variant="green" className="add-button">
            <div className="add-button-content">
              <Plus size={16} />
              <span>Add</span>
            </div>
          </Button>
        </DialogTrigger>
      </div>

      {/* Dialog for Add/Edit Visitor Type */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Visitor Type' : 'Add Visitor Type'}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter visitor type name"
            className="input-margin-top"
          />
        </DialogContent>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdate}>
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Main content area for displaying visitor types */}
      <div className="visitor-type-list-area">
        {loading ? (
          // Loading state
          <p className="loading-message">Loading visitor types...</p>
        ) : visitorTypes.length === 0 ? (
          // Empty state
          <p className="empty-state-message">No visitor types found. Click "Add" to create one.</p>
        ) : (
          // List of visitor types
          <div className="visitor-types-list-container">
            {visitorTypes.map((vt) => (
              <div
                key={vt.id}
                className="visitor-type-item"
              >
                <span className="visitor-type-name">{vt.name}</span>
                <div className="visitor-type-actions">
                  {/* Switch to toggle active status */}
                  <Switch
                    checked={!!vt.is_active} // Ensure boolean
                    onChange={() => handleToggleActive(vt.id, vt.is_active)}
                  />
                  {/* Edit button */}
                  <Button size="icon" variant="outline" onClick={() => handleEdit(vt)}>
                    <Edit2 size={16} className="icon-blue" />
                  </Button>
                  {/* Delete button */}
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(vt.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorTypeSettings;