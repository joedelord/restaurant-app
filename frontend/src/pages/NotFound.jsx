import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>Paga Not Found</h1>
      <p>
        Sivua ei löydy. Palaa <Link to="/">pääsivulle</Link>
      </p>
    </div>
  );
};

export default NotFound;
