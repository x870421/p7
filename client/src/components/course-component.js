import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  let [courseData, setCourseData] = useState(null);
  useEffect(() => {
    console.log("Using effect.");
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
    }

    if (currentUser.user.role == "instructor") {
      CourseService.get(_id)
        .then((data) => {
          console.log(data);
          setCourseData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.user.role == "student") {
      CourseService.getEnrolledCourses(_id)
        .then((data) => {
          console.log(data);
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>請先登入!</p>
          <button
            onClick={handleTakeToLogin}
            className="btn btn-primary btn-lg"
          >
            點我登入
          </button>
        </div>
      )}

      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Welcome to instructor's Course page.</h1>
        </div>
      )}

      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>Welcome to student's Course page.</h1>
        </div>
      )}

      {currentUser && courseData && courseData.length != 0 && (
        <div>
          <p>我們找出的資料...</p>
          {courseData.map((course) => (
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text"> {course.description} </p>
                <p>Student Count: {course.student.length}</p>
                <button className="btn btn-primary"> {course.price} </button>
                <br />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
