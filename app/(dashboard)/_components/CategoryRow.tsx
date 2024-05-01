import { Category } from '@prisma/client';

interface CategoryRowProps {
    category: Category;
}

function CategoryRow({ category }: CategoryRowProps) {
    return (
        <div className='flex items-center gap-2'>
            <span role='img'>{category.icon}</span>
            <span>{category.name}</span>
        </div>
    );
}

export default CategoryRow;
