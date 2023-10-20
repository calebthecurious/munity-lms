"use client";

import { Category } from "@prisma/client";
import {
    FcBusiness,
    FcCollaboration,
    FcEngineering,
    FcHome,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcPicture,
    FcReading,
    FcSportsMode,
    FcTreeStructure
} from "react-icons/fc";
import { IconType } from 'react-icons';
import CategoryItem from "./category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Academics & Science": FcReading,
    "Arts": FcPicture,
    "Music": FcMusic,
    "Business & Finance": FcBusiness,
    "Cooking": FcEngineering,
    "DIY": FcHome,
    "Language": FcCollaboration,
    "Photography": FcOldTimeCamera,
    "Fitness & Wellbeing":  FcSportsMode,
    "Computer": FcMultipleDevices,
    "Outdoor": FcTreeStructure,
}


export const Categories = ({
    items,
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
            <CategoryItem
                key={item.id}
                label={item.name}
                icon={iconMap[item.name]}
                value={item.id}
            />
            ))}
        </div>
    )
}