// reservation spot model
module.exports = function (sequelize, DataTypes) {
    var Spot = sequelize.define("Spot", {
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        },
        car: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        license: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Spot;
};