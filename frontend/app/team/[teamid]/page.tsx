    // app/products/[productID]/client-component.js
    'use client';
import TeamDetails from '@/app/components/TeamDetails';
    import { useParams } from 'next/navigation';

    export default function ClientProductDetails() {
      const params = useParams();
      const { teamid } = params;
      const id = teamid?.toString();
      if (!id) return null;
      return (
        <div>
            <TeamDetails teamId={id}></TeamDetails>
        </div>
      )
    }