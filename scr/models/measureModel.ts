export interface Measure {
    customer_code: string;
    measure_datetime: string;
    measure_type: string;
    image_url: string;
    measure_value: number;
    measure_uuid: string;
    has_confirmed: boolean;
}

let database: Measure[] = [];

export const saveMeasureToDB = async (customer_code: string, measure_datetime: string, measure_type: string, image_url: string, measure_value: number, measure_uuid: string): Promise<Measure | null> => {
    const existingMeasure = database.find(measure => measure.customer_code === customer_code && measure.measure_type === measure_type && measure.measure_datetime.startsWith(measure_datetime.slice(0, 7)));

    if (existingMeasure) return existingMeasure;

    const newMeasure: Measure = {
        customer_code,
        measure_datetime,
        measure_type,
        image_url,
        measure_value,
        measure_uuid,
        has_confirmed: false
    };

    database.push(newMeasure);
    return null;
};

export const updateMeasureInDB = async (measure_uuid: string, confirmed_value: number): Promise<boolean> => {
    const measure = database.find(measure => measure.measure_uuid === measure_uuid);

    if (!measure || measure.has_confirmed) {
        return false;
    }

    measure.measure_value = confirmed_value;
    measure.has_confirmed = true;
    return true;
};

export const findMeasuresByCustomer = async (customer_code: string, measure_type?: string): Promise<Measure[]> => {
    let measures = database.filter(measure => measure.customer_code === customer_code);

    if (measure_type) {
        measure_type = measure_type.toUpperCase();
        measures = measures.filter(measure => measure.measure_type === measure_type);
    }

    return measures;
};
