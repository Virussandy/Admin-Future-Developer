import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [file, setFile] = useState(null);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Add this line
  // const [students, setStudents] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://admin-future-developer.onrender.com/api/auth/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsername(res.data.username);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Unauthorized. Please log in again.");
        navigate("/");
      }
    };
    fetchUser();
    // fetchStudents();
  }, [navigate, token]);

  const fetchHomework = async (classNum) => {
    try {
      const res = await axios.get(
        `https://admin-future-developer.onrender.com/api/homework/by-class/${classNum}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHomeworkList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // const fetchStudents = async () => {
  //   try {
  //     const res = await axios.get('https://admin-future-developer.onrender.com/api/students/all', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setStudents(res.data.students);
  //   } catch (error) {
  //     console.error('Error fetching students:', error);
  //   }
  // };

  // const handleDeleteStudent = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this student?')) return;
  //   try {
  //     await axios.delete(`https://admin-future-developer.onrender.com/api/students/delete/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setStudents(students.filter((s) => s._id !== id));
  //   } catch (error) {
  //     console.error('Failed to delete student:', error);
  //     alert('Failed to delete student');
  //   }
  // };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !classNumber)
      return alert("Please select class and upload a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("className", classNumber); // ✅ Fixed key to match backend

    setLoading(true);
    try {
      await axios.post(
        "https://admin-future-developer.onrender.com/api/homework/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Homework uploaded successfully!");
      setFile(null); // ✅ Reset file input
      fetchHomework(classNumber); // ✅ Refresh list
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(
        `https://admin-future-developer.onrender.com/api/homework/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHomeworkList(homeworkList.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete homework");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
          {username ? `Welcome ${username}` : "Welcome to Dashboard"}
        </h1>

        <form onSubmit={handleUpload} className="space-y-4">
          <select
            className="w-full border p-2 rounded"
            value={classNumber}
            onChange={(e) => {
              const selectedClass = e.target.value;
              setClassNumber(selectedClass);
              setFile(null); // Clear file state
              if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
              fetchHomework(selectedClass); // Load homework for new class
            }}
            required
          >
            <option value="">Select Class</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Class {i + 1}
              </option>
            ))}
          </select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border p-2 rounded bg-gray-50"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload Homework"}
          </button>
        </form>

        {/* Homework List */}
        {homeworkList.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Uploaded Homework</h2>
            <ul className="space-y-3">
              {homeworkList.map((item) => (
                <li
                  key={item._id}
                  className="border p-3 rounded bg-gray-50 flex justify-between items-center"
                >
                  <a
                    href={`https://admin-future-developer.onrender.com/uploads/${item.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {item.file}
                  </a>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          classNumber && (
            <p className="mt-4 text-sm text-gray-600">
              No homework uploaded for Class {classNumber}.
            </p>
          )
        )}

        {/* {students.length > 0 && (
  <div className="mt-10">
    <h2 className="text-xl font-semibold mb-2">Registered Students</h2>
    <ul className="space-y-2">
      {students.map((student) => (
        <li
          key={student._id}
          className="border p-3 rounded bg-white flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-gray-600">Class: {student.className}</p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
          <button
            onClick={() => handleDeleteStudent(student._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  </div>
)} */}
        <button
          onClick={() => navigate("/students")}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          View Registered Students
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
