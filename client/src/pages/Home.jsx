import React, { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
import Navbar from './Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@headlessui/react';
import { Textarea } from '@headlessui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, Group } from '@mantine/core';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import the icons
import 'remixicon/fonts/remixicon.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Home = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [todos, setTodos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState({});
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Renamed state
    const [currentTodo, setCurrentTodo] = useState(null); // Initialize currentTodo state
    const [selectedTodoId, setSelectedTodoId] = useState(null); // To track which todo's date picker is open

    const handleDateChange = (date, todoId) => {
        const updatedTodos = todos.map((todo) =>
            todo._id === todoId ? { ...todo, date } : todo
        );
        setTodos(updatedTodos);
        setSelectedTodoId(null); // Close date picker after selecting a date
    };

    const openEditModal = (todo) => {
        setEditingTodo(todo);
        setTitle(todo.title);
        setDescription(todo.description);
        setIsModalOpen(true);
    };

    // Handle Todo Edit
    const handleEdit = async () => {
        try {
            const res = await axios.put(
                `http://localhost:8000/api/v1/todo/${editingTodo._id}`,
                { title, description },  // Pass both title and description in the request body
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                // Update the todo list locally after successful edit
                setTodos(todos.map(todo => todo._id === editingTodo._id ? { ...todo, title, description } : todo));
                setTitle('');
                setDescription('');
                setIsModalOpen(false); // Close modal after successful update
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            // Handle the error, maybe show a message to the user
        }
    };

    // Handle Todo Delete
    const handleDelete = async (id) => {
        try {
            // Delete todo from the backend
            const res = await axios.delete(
                `http://localhost:8000/api/v1/todo/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message); // Notify user of success
                setTodos(todos.filter(todo => todo._id !== id)); // Remove from state

            }
        } catch (error) {
            toast.error(error.response?.data.message || 'Error deleting todo');
        }
    };

    const addTodoHandler = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/todo",
                { title, description },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setTodos([...todos, res.data.todo]);
                setTitle("");
                setDescription("");
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/todo");
                if (res.data.success) {
                    setTodos(res.data.todos);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchTodo();
    }, [])



    return (
        <div className="bg-mainBlue min-h-screen">
            <Navbar />
            {/* Input Field's */}
            <div className="flex items-center gap-20 mt-5 mx-auto max-w-6xl">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-2/5 border-[2px] rounded-sm py-2 active:outline-[#15919B] outline-[#15919B] px-4 border-[#15919B] placeholder:text-[#272c39]"
                    type="text"
                    placeholder="Add a new todo..."
                />

                <Button
                    onClick={addTodoHandler}
                    className="rounded py-[11px] font-medium px-4 text-sm text-[#FFF7EC] transition bg-[#0C6478] border-2 border-[#FFF7EC]"
                >
                    Add Todo 🚀
                </Button>
            </div>

            {/* Textarea Setup */}
            <div className="max-w-6xl mx-auto">
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-[2px] w-2/5 mt-2 px-3 py-2 active:outline-[#15919B] outline-[#15919B] border-[#15919B] placeholder:text-[#272c39] placeholder:text-md"
                    placeholder="Write a description..."
                />
            </div>

            {/* Card Setup */}
            <div className="max-w-6xl mt-2 mx-auto gap-2 grid grid-cols-4">
                {todos.map((todo) => (
                    <Card key={todo._id} shadow="sm" padding="lg" radius="md" withBorder>
                        {/* Select Date Button */}
                        <Button
                            className="mt-2 text-[#0C6478] font-semibold items-start flex"
                            onClick={() => setSelectedTodoId(todo._id)} // Toggle the calendar visibility
                            variant="outline"
                            color="cyan"
                        >
                            {selectedTodoId === todo._id ? 'Close Calendar' : 'Select Date'}
                        </Button>

                        {/* Render Date Picker if Selected */}
                        {selectedTodoId === todo._id && (
                            <div className="mt-2">
                                <DatePicker
                                    selected={todo.date}
                                    onChange={(date) => handleDateChange(date, todo._id)} // Handle date change
                                    inline
                                />
                            </div>
                        )}

                        {/* Display Selected Date */}
                        {todo.date && (
                            <p className="mt-2 text-sm text-[#248aa1cf]">
                                <span className='font-semibold text-[#0C6478]'>Selected Date :</span> {todo.date.toLocaleDateString()}
                            </p>
                        )}

                        <Group position="apart" mt="md" mb="xs">
                            <h1 className="font-[500] text-[#0C6478] w-full capitalize">{todo.title}</h1>
                            <p className="text-sm w-full">{todo.description}</p>
                        </Group>

                        <div className="flex gap-5 items-center mt-2 mb-2">
                            {/* Edit Icon */}
                            <button
                                onClick={() => openEditModal(todo)} // Open the modal with the todo data
                                className="text-[#0C6478] hover:text-[#4957ed] transition"
                            >
                                <FaEdit size={20} />
                            </button>

                            {/* Delete Icon */}
                            <button
                                onClick={() => handleDelete(todo._id)} // Call the delete handler with todo ID
                                className="text-red-500 hover:text-red-700 transition"
                            >
                                <FaTrashAlt size={20} />
                            </button>
                        </div>

                        {/* Learn More Button */}
                        <Button
                            className="w-32 px-2 mt-5 py-2 rounded-md font-medium text-[#FFF7EC] transition bg-[#0C6478] border-2 border-[#FFF7EC] focus:outline-none focus:ring-2 focus:ring-[#15919B]"
                            onClick={() => setIsDetailsModalOpen(true)} // Open the modal on button click
                        >
                            Learn More
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Edit Todo Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleEdit(); // Call handleEdit to update the todo
                        }}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)} // Close modal
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleEdit} // Call handleEdit on click to update the todo
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Popup Modal */}
            {isDetailsModalOpen && ( // Check the new state
                <div className="fixed inset-0 z-100 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white w-4/5 md:w-3/5 lg:w-3/5 xl:w-2/5 p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Todo Details</h2>
                        <div>
                            <h3 className="font-medium text-[#0C6478] mb-2">Title</h3>
                            <p className="mb-4 text-gray-700">{currentTodo?.title}</p>
                            <h3 className="font-medium text-[#0C6478] mb-2">Description</h3>
                            <p className="text-gray-700">{currentTodo?.description}</p>
                        </div>
                        <button
                            onClick={() => setIsDetailsModalOpen(false)} // Close the modal on button click
                            className="mt-5 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Home







