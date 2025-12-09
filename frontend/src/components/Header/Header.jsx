import React from "react";
import "./Header.css";

const Header = () => {
    return (
        <div className="header">
            <div className="header-contents">
                <h2>Order your favourite food here</h2>
                <p>
                    Delicious meals delivered right to your doorstep! Explore
                    our menu and enjoy fresh, hot food anytime, anywhere — fast,
                    easy, and tasty.
                </p>
                <button>View menu</button>
            </div>
        </div>
    );
};

export default Header;
