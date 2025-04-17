import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function EmployeeForm({ onSubmit, initialData, isEditing }) {
  const [employee, setEmployee] = useState({
    name: '',
    position: '',
    employeeId: '',
    email: '',
    phone: '',
    address: '',
    joiningDate: '',
    profileImage: null
  });
  
  const [preview, setPreview] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setEmployee({
        ...initialData,
        joiningDate: initialData.joiningDate ? new Date(initialData.joiningDate).toISOString().split('T')[0] : '',
        profileImage: null // Don't load the image in the file input
      });
      
      if (initialData.profileImage) {
        setPreview(initialData.profileImage);
      }
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    setEmployee({ ...employee, profileImage: file });
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!employee.name || !employee.position || !employee.employeeId || !employee.email || !employee.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Form data for file upload
    const formData = new FormData();
    Object.keys(employee).forEach(key => {
      if (key === 'profileImage') {
        if (employee.profileImage) {
          formData.append('profileImage', employee.profileImage);
        }
      } else if (employee[key]) {
        formData.append(key, employee[key]);
      }
    });
    
    try {
      await onSubmit(formData);
      toast.success(isEditing ? 'Employee updated successfully!' : 'Employee added successfully!');
    } catch (err) {
      toast.error('Error saving employee data: ' + (err.response?.data?.message || err.message));
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={employee.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Employee ID *
            </label>
            <input
              type="text"
              name="employeeId"
              value={employee.employeeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
              disabled={isEditing} // Can't change employeeId when editing
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Joining Date
            </label>
            <input
              type="date"
              name="joiningDate"
              value={employee.joiningDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={employee.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows="3"
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
              accept="image/*"
            />
            
            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <img 
                  src={preview} 
                  alt="Profile preview" 
                  className="w-40 h-40 object-cover border rounded" 
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}