import axios from "axios";
import { useState } from "react";

const Form = () => {

    
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/metric", formData);

      console.log(res.data);
    //   console.log(formData);

      alert("User Added");

      setFormData({
        name: "",
        email: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
        />
        <br />

        <input
          type="email"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="gender"
          placeholder="gender"
          value={formData.gender}
          onChange={handleChange}
        />
        <br />
        <input
          type="number"
          name="age"
          placeholder="age"
          value={formData.age}
          onChange={handleChange}
        />
        <br />
        <input
          type="number"
          name="height"
          placeholder="height"
          value={formData.height}
          onChange={handleChange}
        />
        <br />
        <input
          type="number"
          name="weight"
          placeholder="weight"
          value={formData.weight}
          onChange={handleChange}
        />
        <br />

        <button type="submit">calculate</button>
      </form>
    </div>
  );
};
export default Form;
