import React from 'react';
import Icon from './Icon';
import type { Stat } from '../types';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

const StatCard: React.FC<Stat> = ({ title, value, change, changeType, iconName }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';

  const displayValue = typeof value === 'number' ? formatCurrency(value) : value;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition-transform transform hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-brand-gray-500">{title}</p>
        <p className="text-3xl font-bold text-brand-gray-800 mt-1">{displayValue}</p>
        <div className="flex items-center mt-2">
          <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
          <span className="text-xs text-brand-gray-400 ml-1">vs mês passado</span>
        </div>
      </div>
      <div className={`p-3 rounded-full bg-brand-gray-100`}>
        <Icon name={iconName} className={`h-6 w-6 text-brand-blue`} />
      </div>
    </div>
  );
};

export default StatCard;
