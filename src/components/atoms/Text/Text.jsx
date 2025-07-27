import React from "react";
import clsx from "clsx";

const Text = ({ 
  children, 
  variant = "body", 
  size = "medium",
  weight = "normal",
  color = "default",
  as: Component = "p",
  className = "",
  ...props 
}) => {
  const variantClasses = {
    heading: "font-bold",
    subheading: "font-semibold",
    body: "font-normal",
    caption: "font-normal text-sm"
  };

  const sizeClasses = {
    xs: "text-xs",
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl"
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  };

  const colorClasses = {
    default: "text-gray-900",
    muted: "text-gray-600",
    light: "text-gray-400",
    white: "text-white",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600"
  };

  const textClass = clsx(
    variantClasses[variant],
    sizeClasses[size],
    weightClasses[weight],
    colorClasses[color],
    className
  );

  return (
    <Component className={textClass} {...props}>
      {children}
    </Component>
  );
};

export default Text;
