import { DataTypes, Model } from 'sequelize';

export default function defineTransactionModel(sequelize) {
    class Transaction extends Model {}

    Transaction.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('income', 'expense'),
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: { min: 0 },
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            recurring: {
                type: DataTypes.ENUM('none', 'weekly', 'monthly'),
                allowNull: false,
                defaultValue: 'none',
            },
        },
        {
            sequelize,
            modelName: 'Transaction',
            tableName: 'Transactions',
            timestamps: true,
            underscored: false,
        }
    );

    return Transaction;
}



