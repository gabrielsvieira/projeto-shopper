import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Measure, saveMeasureToDB, updateMeasureInDB, findMeasuresByCustomer } from '../models/measureModel';

export const processImage = async (image: string) => {
    try {
        const response = await axios.post('https://api.google.com/gemini', {
            image,
            key: process.env.GEMINI_API_KEY
        });

        const image_url = response.data.image_url;
        const measure_value = parseInt(response.data.measure_value, 10);
        const measure_uuid = uuidv4();

        return { image_url, measure_value, measure_uuid };
    } catch (error) {
        throw new Error('Failed to process image');
    }
};

export const saveMeasure = async (customer_code: string, measure_datetime: string, measure_type: string, image_url: string, measure_value: number, measure_uuid: string): Promise<Measure | null> => {
    const existingMeasure = await saveMeasureToDB(customer_code, measure_datetime, measure_type, image_url, measure_value, measure_uuid);
    return existingMeasure;
};

export const confirmMeasureInDB = async (measure_uuid: string, confirmed_value: number): Promise<boolean> => {
    return await updateMeasureInDB(measure_uuid, confirmed_value);
};

export const getMeasures = async (customer_code: string, measure_type?: string): Promise<Measure[]> => {
    return await findMeasuresByCustomer(customer_code, measure_type);
};
