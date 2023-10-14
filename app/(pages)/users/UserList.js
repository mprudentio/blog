"use client";
import { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, Form, Input, InputNumber, Select } from "antd";
import { AiOutlinePlus, AiFillEdit, AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";

const UserList = () => {
  const [users, setUsers] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editedUser, setEditedUser] = useState();
  const [modal, setModal] = useState(false);
  const [form] = Form.useForm();
  const getUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`,
        },
        cache: "no-store",
      });
      if (response) {
        const result = await response.json();
        setUsersLoading(false);
        setUsers(result);
      } else {
        setUsersError(`HTTP Error: ${response.status}`);
        setUsersLoading(false);
      }
    } catch (error) {
      setUsersLoading(false);
      setUsersError(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const handleCloseModal = () => {
    setModal(false);
    if (edit) {
      setEdit(null);
    }
    form.resetFields();
  };
  const columns = [
    {
      title: "Name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      dataIndex: "name",
    },
    {
      title: "Email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      dataIndex: "email",
    },
    {
      title: "Gender",
      key: "gender",
      sorter: (a, b) => a.gender.length - b.gender.length,
      dataIndex: "gender",
      render: (gender) => gender[0].toUpperCase() + gender.slice(1),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      key: "status",
      render: (status) => status[0].toUpperCase() + status.slice(1),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-1">
          <AiFillEdit
            type="primary"
            size={25}
            className="bg-emerald-500 hover:bg-emerald-300 text-white p-1 rounded-lg"
            onClick={() => {
              handleEditButton(record);
            }}
          />
          <AiFillDelete
            type="primary"
            size={25}
            className="bg-red-500 hover:bg-red-300 text-white p-1 rounded-lg"
            onClick={() => handleDeleteUser(record)}
          />
        </div>
      ),
    },
  ];
  const handleEditButton = (selectedUser) => {
    setEdit(true);
    setEditedUser(selectedUser.id);
    setModal(true);
    form.setFieldsValue({
      name: selectedUser.name,
      email: selectedUser.email,
      gender: selectedUser.gender,
      status: selectedUser.status,
    });
  };
  const handleSubmitUser = async (values) => {
    if (edit) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/users/${editedUser}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`,
            },
            body: JSON.stringify(values),
          }
        );

        if (response) {
          const updatedUser = await response.json();
          form.resetFields();
          setEdit(false);
          setEditedUser(null);
          setModal(false);
          getUsers();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "User updated successfully",
          });
        } else {
          setUsersError(`HTTP Error: ${response.status}`);
        }
      } catch (error) {
        setUsersError("An error occurred:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "User update failed",
        });
      }
    } else {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`,
          },
          body: JSON.stringify(values),
        });

        if (response) {
          const result = await response.json();
          form.resetFields();
          setModal(false);
          getUsers();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "User created successfully",
          });
        } else {
          setUsersError(`HTTP Error: ${response.status}`);
        }
      } catch (error) {
        setUsersError("An error occurred:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "User created failed",
        });
      }
    }
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          fetch(`${process.env.NEXT_PUBLIC_API}/users/${user.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`,
            },
          })
            .then((response) => {
              if (response.status === 204) {
                getUsers();
                Swal.fire({
                  icon: "success",
                  title: "Success!",
                  text: "User deleted successfully",
                });
              } else {
                throw new Error("Failed to delete user");
              }
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: error.message || "User deleted failed",
              });
            });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error || "User deleted failed",
          });
        }
      } else {
        Swal.fire("Cancelled", "Your data is safe :)", "error");
      }
    });
  };

  const validateUserEmail = async (_, value) => {
    if (!edit) {
      if (users.map((user) => user.email).includes(value)) {
        throw new Error("Email with this address is already exists");
      }
    }
  };
  return (
    <div>
      {!usersLoading && usersError && <p>{usersError.toString()}</p>}
      {!usersLoading && users && (
        <div className="pt-[90px] px-[30px]">
          <Button
            type="primary"
            icon={<AiOutlinePlus />}
            size={30}
            onClick={() => setModal(true)}
            className="bg-green-500 hover:bg-green-300 px-4 py-5 text-md font-bold flex justify-center items-center mb-3"
          >
            Add
          </Button>
          <Table
            columns={columns}
            dataSource={users}
            rowKey={(record) => record.id}
            loading={usersLoading}
            pagination={{ pageSize: 5 }}
            scroll={{
              x: 240,
            }}
            cellFontSizeMD={100}
          />
          <Modal
            title={<p className="text-lg">{edit ? "Edit User" : "Add User"}</p>}
            open={modal}
            centered
            onCancel={handleCloseModal}
            footer={null}
          >
            <Form layout="vertical" onFinish={handleSubmitUser} form={form}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the name",
                  },
                ]}
              >
                <Input placeholder="Enter User's Name" className="py-2" />
              </Form.Item>
              <Form.Item
                name="email"
                label="email"
                className="w-full"
                rules={[
                  {
                    type: "email",
                    message: "The input is not a valid email!",
                  },
                  {
                    required: true,
                    message: "Please input the email!",
                  },
                  {
                    validator: validateUserEmail,
                  },
                ]}
              >
                <Input
                  id="email"
                  className="py-2"
                  placeholder="Enter User's Email"
                />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                    message: "Please select a gender",
                  },
                ]}
              >
                <Select
                  className="w-full"
                  style={{
                    width: 120,
                  }}
                  allowClear
                  options={[
                    {
                      value: "male",
                      label: "Male",
                    },
                    {
                      value: "female",
                      label: "Female",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  {
                    required: true,
                    message: "Please select a status",
                  },
                ]}
              >
                <Select
                  className="w-full"
                  style={{
                    width: 120,
                  }}
                  allowClear
                  options={[
                    {
                      value: "active",
                      label: "Active",
                    },
                    {
                      value: "inactive",
                      label: "Inactive",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item className="flex flex-row-reverse">
                <Button
                  htmlType="submit"
                  type="primary"
                  className="bg-green-500 hover:bg-green-300 py-6 font-bold text-md flex items-center justify-center"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default UserList;
