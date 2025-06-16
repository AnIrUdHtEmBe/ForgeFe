import type { JSX } from "react"
import Nav from "../../components/Nav/Nav";
import './styles.css';

interface OutlayProps { 
  children: JSX.Element;
}


const Outlay = (props: OutlayProps) => {
  return (
    <div className="outlay-container">
      <div className="outlay-top-container">
        <Nav />
      </div>  
      <div className="outlay-children-container">
        {props.children}
      </div>
    </div>
  )
}; 



export default Outlay;