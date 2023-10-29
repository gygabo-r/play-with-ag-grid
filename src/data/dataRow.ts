import { faker } from '@faker-js/faker';

export const dates = new Set(Array.from({ length: 10 }, (_, i) => new Date(2023, 1, i + 1).toISOString()));

const persons: Person[] = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: faker.person.fullName() }));
const personsMap: Record<number, Person> = persons.reduce((acc, curr) => {
    return { ...acc, [curr.id]: curr };
}, {});

export const units: UnitDescriptor[] = [
    { name: 'boolean', id: 1, dataType: 'boolean' },
    { name: 'time', id: 2, dataType: 'time' },
    { name: 'text', id: 3, dataType: 'string' },
    { name: 'number', id: 4, dataType: 'number' },
];
export const products: Product[] = [
    {
        name: faker.commerce.productName(),
        id: 1,
        units: [...units],
    },
    {
        name: faker.commerce.productName(),
        id: 2,
        units: [...units],
    },
];

function getValue(dataType: 'number' | 'string' | 'time' | 'boolean', index: number) {
    if (dataType === 'number') {
        return index;
    }
    if (dataType === 'string') {
        return 'text' + index;
    }
    if (dataType === 'boolean') {
        return index % 4 ? 'Yes' : 'No';
    }

    const hours = index % 24;
    const minutes = index % 60;
    return hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
}

function mapUnits(po: Product, d: string, p: { name: string; id: number }) {
    return po.units.map((u, index) => {
        const entry: Entry = {
            date: d,
            unitId: u.id,
            personId: p.id,
            productId: po.id,
            value: getValue(u.dataType, index + p.id),
        };
        return entry;
    });
}

function mapProducts(d: string, p: { name: string; id: number }) {
    return products
        .map(po => {
            return mapUnits(po, d, p);
        })
        .flat();
}

export function getEntries() {
    return persons
        .map(p => {
            return [...dates.values()]
                .map(d => {
                    return mapProducts(d, p).flat();
                })
                .flat();
        })
        .flat();
}

export function getRows() {
    const dataMap: Record<number, Entry[]> = getEntries().reduce(
        (acc, curr) => {
            if (acc[curr.personId]) {
                return { ...acc, [curr.personId]: [...acc[curr.personId], curr] };
            }
            return { ...acc, [curr.personId]: [curr] };
        },
        {} as Record<number, Entry[]>
    );

    return persons.map(key => {
        const numberKey = key.id;
        const row: Row = { personId: numberKey, personName: personsMap[numberKey].name };
        return dataMap[numberKey].reduce((acc, curr) => {
            const datePart = curr.date.substring(0, 10);
            const productPart = curr.productId;
            const unitPart = curr.unitId;

            const fieldKey = `${datePart}_${productPart}_${unitPart}`;
            return {
                ...acc,
                [fieldKey]: curr.value,
            };
        }, row);
    });
}

export type Row = {
    personId: number;
    personName: string;
    [key: string]: number | string | undefined;
};

type Entry = {
    date: string;
    personId: number;
    productId: number;
    unitId: number;
    value: string | number;
};

type Person = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    units: UnitDescriptor[];
};

type UnitDescriptor = {
    id: number;
    name: string;
    dataType: 'number' | 'string' | 'time' | 'boolean';
};
