import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './JsonServer.css'

function JsonServer(){
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState(null)

    useEffect(()=>{
        fetchData()
    },[])

    const fetchData = () => {
        axios.get('http://localhost:3031/users')
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editMode) {
            axios.put(`http://localhost:3031/users/${editId}`, formData)
                .then(res => {
                    setEditMode(false)
                    setEditId(null)
                    fetchData()
                })
                .catch(err => console.log(err))
        } else {
            axios.post('http://localhost:3031/users', formData)
                .then(res => {
                    setFormData({ email: '', password: '' })
                    fetchData()
                })
                .catch(err => console.log(err))
        }
    }

    const handleEdit = (user) => {
        setFormData({ email: user.email, password: user.password })
        setEditMode(true)
        setEditId(user.id)
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3031/users/${id}`)
            .then(res => fetchData())
            .catch(err => console.log(err))
    }

    return(
        <div>
        <body>
        <div className='container mt-5'>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>Email</label>
                    <input 
                        type='email' 
                        className='form-control' 
                        id='email' 
                        name='email'
                        value={formData.email}
                        placeholder='Email' 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>Password</label>
                    <input 
                        type='password' 
                        className='form-control' 
                        id='password' 
                        name='password'
                        value={formData.password} 
                        placeholder='Password'
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <button type='submit' className='btn btn-primary'>
                    {editMode ? 'Update User' : 'Add User'}
                </button>
            </form>
            <table className='table mt-5'>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, i) => (
                        <tr key={i}>
                            <td>{d.email}</td>
                            <td>{d.password}</td>
                            <td>
                                <button className='btn btn-warning me-2' onClick={() => handleEdit(d)}>Edit</button>
                                <button className='btn btn-danger' onClick={() => handleDelete(d.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </body>
        </div>
    )
}

export default JsonServer
