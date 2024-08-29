import { Request, Response } from 'express';
import { processImage, saveMeasure, confirmMeasureInDB, getMeasures } from '../services/geminiService';

export const uploadMeasure = async (req: Request, res: Response) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Missing required fields'
        });
    }

    try {
        const { image_url, measure_value, measure_uuid } = await processImage(image);

        const existingMeasure = await saveMeasure(customer_code, measure_datetime, measure_type, image_url, measure_value, measure_uuid);

        if (existingMeasure) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada'
            });
        }

        return res.status(200).json({
            image_url,
            measure_value,
            measure_uuid
        });

    } catch (error) {
        return res.status(500).json({
            error_code: 'GEMINI_API_ERROR',
            error_description: 'Failed to process image'
        });
    }
};

export const confirmMeasure = async (req: Request, res: Response) => {
    const { measure_uuid, confirmed_value } = req.body;

    if (!measure_uuid || !confirmed_value) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Missing required fields'
        });
    }

    try {
        const result = await confirmMeasureInDB(measure_uuid, confirmed_value);

        if (!result) {
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Measure not found'
            });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        return res.status(500).json({
            error_code: 'DATABASE_ERROR',
            error_description: 'Failed to confirm measure'
        });
    }
};

export const listMeasures = async (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Customer code is required'
        });
    }

    try {
        const measures = await getMeasures(customer_code, measure_type as string);

        if (measures.length === 0) {
            return res.status(404).json({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'No measures found'
            });
        }

        return res.status(200).json({
            customer_code,
            measures
        });

    } catch (error) {
        return res.status(500).json({
            error_code: 'DATABASE_ERROR',
            error_description: 'Failed to retrieve measures'
        });
    }
};
