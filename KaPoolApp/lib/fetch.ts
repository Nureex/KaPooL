import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export const useFetch = <T>(url: string, options?: any) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url, options); // Using Axios to fetch
      setData(response.data); // Assuming response.data is the correct format
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

const API_URL = 'http://192.168.59.186:5000/api';  
