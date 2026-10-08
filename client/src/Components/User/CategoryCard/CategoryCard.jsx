import React from 'react'
import './CategoryCard.css'

const CategoryCard = ({ image, name }) => {
    return (
        <div className="category-card">

            <div className="category-image-box">
                <img
                    src={image}
                    alt={name}
                    className="category-image"
                />
            </div>

            <p className="category-name">
                {name}
            </p>

        </div>
    )
}

export default CategoryCard