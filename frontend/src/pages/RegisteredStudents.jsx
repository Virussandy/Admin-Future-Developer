import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisteredStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "https://admin-future-developer.onrender.com/api/students/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Unauthorized. Please login again.");
        navigate("/");
      }
    };

    fetchStudents();
  }, [token, navigate]);

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axios.delete(
        `https://admin-future-developer.onrender.com/api/students/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(students.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Registered Students
        </h1>

        {students.length > 0 ? (
          <ul className="space-y-2">
            {students.map((student) => (
              <li
                key={student._id}
                className="border p-3 rounded bg-white flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-600">
                    Class: {student.classNumber}
                  </p>
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
        ) : (
          <p className="text-center text-gray-600">
            No students registered yet.
          </p>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default RegisteredStudents;
