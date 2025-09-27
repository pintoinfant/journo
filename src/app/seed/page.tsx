"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeedPage() {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      setError(null);
      setResult(null);

      console.log('🌱 Starting database seeding...');
      
      const response = await fetch('/api/seed-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Database seeded successfully:', data);
        setResult(data);
      } else {
        console.error('❌ Database seeding failed:', data.error);
        setError(data.error || 'Failed to seed database');
      }
    } catch (err) {
      console.error('💥 Error seeding database:', err);
      setError('Network error while seeding database');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center">
            🌱 Database Seeder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-300 text-sm text-center">
            This will populate the database with sample movies, users, genres, and ratings for testing the graph visualization.
          </div>
          
          <Button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {seeding ? 'Seeding Database...' : 'Seed Database'}
          </Button>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
              <div className="text-red-400 font-semibold">Error</div>
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {result && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
              <div className="text-green-400 font-semibold">Success!</div>
              <div className="text-green-300 text-sm space-y-1">
                <div>✅ Database seeded successfully</div>
                <div>📊 Stats:</div>
                <div className="ml-4">
                  <div>• {result.stats.movies} movies</div>
                  <div>• {result.stats.users} users</div>
                  <div>• {result.stats.genres} genres</div>
                  <div>• {result.stats.ratings} ratings</div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="text-center">
              <Button
                onClick={() => window.location.href = '/graph'}
                className="bg-green-600 hover:bg-green-700"
              >
                View Graph
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}