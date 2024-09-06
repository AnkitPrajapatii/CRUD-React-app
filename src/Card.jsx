import { EditOutlined, MailOutlined, GlobalOutlined, PhoneOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Button } from 'antd';
import { useEffect, useState } from 'react';
import Axios from "axios";

const { Meta } = Card;

const CardList = () => {
  const [users, setUsers] = useState([]);
  const [modelData, setModelData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    website: "",
  });
  const [isEditing, setIsEditing] = useState(false); // For differentiating between creating and editing

  // Fetch users from JSONPlaceholder API
  const getUser = async () => {
    try {
      const response = await Axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Create new user
  const createUser = () => {
    const newUser = {
      id: users.length + 1, // Assuming IDs are incremental and unique
      name: modelData.name,
      email: modelData.email,
      phone: modelData.phone,
      website: modelData.website,
    };
    setUsers([...users, newUser]);
    clearForm();
  };

  // Update user in local state
  const updateUser = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === modelData.id
          ? { ...user, name: modelData.name, email: modelData.email, phone: modelData.phone, website: modelData.website }
          : user
      )
    );
    clearForm(); // Clear form after updating
    setIsEditing(false);
  };

  // Delete user from local state
  const deleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  // Clear form data
  const clearForm = () => {
    setModelData({ id: "", name: "", email: "", phone: "", website: "" });
    setIsEditing(false); // Reset the editing state
  };

  // Handle input changes in modal
  const onChangeHandler = (e) => {
    setModelData({
      ...modelData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for create or update
  const onSubmitHandler = () => {
    if (isEditing) {
      updateUser();
    } else {
      createUser();
    }
  };

  // Pre-fill modal with user data for editing
  const onEditClick = (user) => {
    setModelData({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      website: user.website,
    });
    setIsEditing(true);
  };

  // Handle delete click
  const onDeleteClick = (id) => {
    deleteUser(id);
  };

  return (
    <>
        {/* Add New User Button */}
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => clearForm()} // Reset form for adding a new user
          style={{ margin: '20px 10px' }}
        />
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {users.map((user) => (
          <Card
            key={user.id}
            style={{
              width: 350,
              margin: 10,
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <EditOutlined
                key="edit"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => onEditClick(user)}
              />,
              <DeleteOutlined key="delete" onClick={() => onDeleteClick(user.id)} />,
            ]}
          >
            <Meta title={user.name} />
            <div style={{ display: "flex", flexDirection: 'column', fontSize: 16, marginBottom: 0 }}>
              <p><MailOutlined style={{ margin: 15 }} />{user.email}</p>
              <p><PhoneOutlined style={{ margin: 15 }} />{user.phone}</p>
              <p><GlobalOutlined style={{ margin: 15 }} />{user.website}</p>
            </div>
          </Card>
        ))}
      </div>


      {/* Modal */}
      <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{isEditing ? "Edit User" : "Add New User"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 d-flex gap-2">
                  <label htmlFor="name" className="col-form-label">Name:</label>
                  <input type="text" className="form-control" id="recipient-name" name='name' value={modelData.name} onChange={onChangeHandler} />
                </div>
                <div className="mb-3 d-flex gap-2">
                  <label htmlFor="email" className="col-form-label">Email:</label>
                  <input type="email" className="form-control" id="recipient-email" name='email' value={modelData.email} onChange={onChangeHandler} />
                </div>
                <div className="mb-3 d-flex gap-2">
                  <label htmlFor="phone" className="col-form-label">Phone:</label>
                  <input type="number" className="form-control" id="recipient-phone" name='phone' value={modelData.phone} onChange={onChangeHandler} />
                </div>
                <div className="mb-3 d-flex gap-2">
                  <label htmlFor="website" className="col-form-label">Website:</label>
                  <input type="text" className="form-control" id="recipient-website" name='website' value={modelData.website} onChange={onChangeHandler} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={onSubmitHandler}>
                {isEditing ? "Save changes" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardList;
