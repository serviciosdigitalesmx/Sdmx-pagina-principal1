import { Request, Response } from 'express';
import { supabase } from '../services/supabase.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';

export const createCheckout = async (req: Request, res: Response) => {
  try {
    // Tu lógica de checkout aquí
    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    return res.status(400).json({ success: false, error: { message: getApiErrorMessage(error, 'Checkout error') } });
  }
};
