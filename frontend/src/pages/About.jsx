import { Link } from "react-router-dom";
import { useState } from "react";

const About = () => {
  const [number, setNumber] = useState(0);
  return (
    <div>
      <h1>Tervetuloa about-sivulle</h1>
      <button
        className="bg-sky-500 hover:bg-sky-700 rounded-full w-10 p-1 m-4"
        onClick={() => setNumber((prev) => prev + 1)}
      >
        +
      </button>
      <button
        className="bg-sky-500 hover:bg-sky-700 rounded-full w-20 p-1 m-4"
        onClick={() => setNumber(() => 0)}
      >
        reset
      </button>
      <button
        className="bg-sky-500 hover:bg-sky-700 rounded-full w-10 p-1 m-4"
        onClick={() => setNumber((prev) => prev - 1)}
      >
        -
      </button>
      <p className="border-2 m-5 w-10">{number}</p>
      <Link to="/">Takaisin kotiin</Link>
    </div>
  );
};

export default About;
