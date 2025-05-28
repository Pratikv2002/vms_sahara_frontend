import React, { useEffect, useState, useRef } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';

// Mock API functions to simulate backend operations
// In a real application, these would be actual API calls (e.g., using fetch or axios)
const mockVisitorTypesData = [
  { id: '1', name: 'Guest', is_active: true },
  { id: '2', name: 'Vendor', is_active: false },
  { id: '3', name: 'Employee', is_active: true },
];

let nextId = mockVisitorTypesData.length + 1;

const simulateApiCall = (data, delay = 500) => {
  return new Promise(resolve => setTimeout(() => resolve({ data }), delay));
};

const mockApi = {
  getVisitorTypes: async () => {
    // Simulate fetching data
    return simulateApiCall({ data: { results: mockVisitorTypesData } });
  },
  addVisitorType: async (name) => {
    // Simulate adding a new visitor type
    const newVisitorType = { id: String(nextId++), name, is_active: true };
    mockVisitorTypesData.push(newVisitorType);
    return simulateApiCall({ data: newVisitorType });
  },
  updateVisitorType: async (id, name) => {
    // Simulate updating an existing visitor type
    const index = mockVisitorTypesData.findIndex(vt => vt.id === id);
    if (index !== -1) {
      mockVisitorTypesData[index].name = name;
    }
    return simulateApiCall({ data: mockVisitorTypesData[index] });
  },
  deleteVisitorType: async (id) => {
    // Simulate deleting a visitor type
    const initialLength = mockVisitorTypesData.length;
    mockVisitorTypesData.splice(mockVisitorTypesData.findIndex(vt => vt.id === id), 1);
    return simulateApiCall({ success: mockVisitorTypesData.length < initialLength });
  },
  toggleVisitorTypeActive: async (id, isActive) => {
    // Simulate activating/deactivating a visitor type
    const index = mockVisitorTypesData.findIndex(vt => vt.id === id);
    if (index !== -1) {
      mockVisitorTypesData[index].is_active = isActive;
    }
    return simulateApiCall({ data: mockVisitorTypesData[index] });
  },
};

// Simple Switch component using button and Tailwind
const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
      checked ? 'bg-green-500' : 'bg-gray-300'
    } focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-200`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Simple Button component
const Button = ({ children, onClick, size = 'md', variant = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:pointer-events-none';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    icon: 'p-2',
  };
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 hover:bg-gray-100 focus:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Input component
const Input = ({ value, onChange, placeholder, className = '', ...props }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${className}`}
    {...props}
  />
);

// Simple Dialog component (basic modal)
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg transform transition-all sm:my-8 sm:w-full"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Dialog subcomponents
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children }) => <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
const DialogContent = ({ children }) => <div>{children}</div>;
const DialogFooter = ({ children }) => <div className="mt-6 flex justify-end gap-2">{children}</div>;

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

  // Function to fetch visitor types from the mock API
  const fetchVisitorTypes = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getVisitorTypes();
      setVisitorTypes(res.data.data.results);
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
        await mockApi.updateVisitorType(editingId, name);
      } else {
        await mockApi.addVisitorType(name);
      }
      setName(''); // Clear input field
      setEditingId(null); // Reset editing state
      setOpen(false); // Close the dialog
      fetchVisitorTypes(); // Refresh the list
    } catch (error) {
      console.error("Failed to add/update visitor type:", error);
    }
  };

  // Function to handle deleting a visitor type
  const handleDelete = async (id) => {
    // In a real app, you might want a confirmation dialog here
    try {
      await mockApi.deleteVisitorType(id);
      fetchVisitorTypes(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete visitor type:", error);
    }
  };

  // Function to handle toggling the active status of a visitor type
  const handleToggleActive = async (id, isActive) => {
    try {
      await mockApi.toggleVisitorTypeActive(id, !isActive); // Toggle the status
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
    <div className="max-w-3xl mx-auto mt-10 shadow-xl bg-white rounded-lg p-6 font-sans">
      {/* Header section with title and Add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Visitor Types</h2>
        <DialogTrigger
          onClick={() => {
            setOpen(true); // Open dialog
            setName(''); // Clear name for new entry
            setEditingId(null); // Ensure no ID is set for new entry
          }}
        >
          <Button size="sm" variant="green" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add</span>
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
            className="mt-2"
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
      <div className="mt-4">
        {loading ? (
          // Loading state
          <p className="text-center text-gray-500 py-8">Loading visitor types...</p>
        ) : visitorTypes.length === 0 ? (
          // Empty state
          <p className="text-center text-gray-500 py-8">No visitor types found. Click "Add" to create one.</p>
        ) : (
          // List of visitor types
          <div className="space-y-4">
            {visitorTypes.map((vt) => (
              <div
                key={vt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100"
              >
                <span className="font-medium text-gray-800 text-lg">{vt.name}</span>
                <div className="flex items-center gap-3">
                  {/* Switch to toggle active status */}
                  <Switch
                    checked={!!vt.is_active}
                    onChange={() => handleToggleActive(vt.id, vt.is_active)}
                  />
                  {/* Edit button */}
                  <Button size="icon" variant="outline" onClick={() => handleEdit(vt)}>
                    <Edit2 className="w-4 h-4 text-blue-500" />
                  </Button>
                  {/* Delete button */}
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(vt.id)}>
                    <Trash2 className="w-4 h-4" />
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
