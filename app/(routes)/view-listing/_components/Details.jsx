
import GoogleMapSection from '@/app/_components/GoogleMapSection'
import { Button } from '@/components/ui/button'
import { Bath, BedDouble, CarFront, Drill, Home, LandPlot, MapPin, Share } from 'lucide-react'

import React from 'react'
import AgentDetail from './AgentDetail'

function Details ({ listingDetail }) {
  const getPropertyTypeTranslated = (propertyType) => {
    switch (propertyType) {
      case 'Single Family House':
        return 'Maison individuelle'
      case 'Town House':
        return 'Maison de ville'
      case 'Condo':
        return 'Copropriété'
      default:
        return 'Type de propriété inconnu' // or any default translation
    }
  }

  return listingDetail && (
    <div className='my-6 flex gap-2 flex-col'>
    <div className='flex justify-between items-center'>
        <div>
            <h2 className='font-bold text-3xl'> {listingDetail?.price} FCFA</h2>
            <h2 className='text-gray-500 text-lg flex gap-2'>
                <MapPin />
                {listingDetail?.address}</h2>
        </div>
        <Button className="flex gap-2"> <Share /> Partager</Button>
    </div>
    <hr></hr>
     <div className='mt-4 flex flex-col gap-3'>
        <h2 className=' font-bold text-2xl'>Principales caractéristiques</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 '>
            <h2 className='flex gap-2 items-center bg-purple-100
    rounded-lg p-3 text-primary justify-center'>
                <Home />
                {getPropertyTypeTranslated(listingDetail?.propertyType)}
            </h2>
            <h2 className='flex gap-2 items-center justify-center bg-purple-100
     rounded-lg p-3 text-primary'>
                <Drill />
                Intégré  {listingDetail?.builtIn}
            </h2>
            <h2 className='flex gap-2 items-center justify-center bg-purple-100 rounded-lg p-3 text-primary'>
                <LandPlot />
                {listingDetail?.area}
            </h2>
            <h2 className='flex gap-2 items-center bg-purple-100
    rounded-lg p-3 text-primary justify-center'>
                <BedDouble />
                {listingDetail.bedroom} Lit
            </h2>
            <h2 className='flex gap-2 items-center justify-center bg-purple-100
     rounded-lg p-3 text-primary'>
                <Bath />
                {listingDetail.bathroom} Salle de bain
            </h2>
            <h2 className='flex gap-2 items-center justify-center bg-purple-100 rounded-lg p-3 text-primary'>
                <CarFront />
                {listingDetail.parking} Parking
            </h2>
        </div>

    </div>
    <div className='mt-4'>
        <h2 className='font-bold text-2xl '>Ce qu'il y a de spécial</h2>
        <p className='text-gray-600 '>{listingDetail?.description}</p>
    </div>
    <div>
        <h2 className='font-bold text-2xl '>Trouver sur la carte</h2>
        <GoogleMapSection
        coordinates={listingDetail.coordinates}
        listing={[listingDetail]}
        />
    </div>
    <div>
    <h2 className='font-bold text-2xl '>Contacter l'agent</h2>

       <AgentDetail listingDetail={listingDetail} />
    </div>
</div>
  )
}

export default Details
