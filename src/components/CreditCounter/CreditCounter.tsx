import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { creditService } from '../../api/services';

const CreditCounter: React.FC = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await creditService.getCredits();
        setCredits(response.credits);
        setError(null);
      } catch (err) {
        setError('Failed to load credits');
        console.error('Error fetching credits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent style={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Available Credits
        </Typography>
        <Typography variant="h4" component="div" style={{ marginTop: '10px' }}>
          {credits}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CreditCounter; 