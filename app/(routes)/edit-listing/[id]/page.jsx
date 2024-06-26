/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */
'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import FileUpload from '../_components/FileUpload'
import { Loader } from 'lucide-react'

function EditListing ({ params }) {
  const { user } = useUser()
  const router = useRouter()
  const [listing, setListing] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // console.log(params.split('/')[2]);
    user && verifyUserRecord()
  }, [user])

  const verifyUserRecord = async () => {
    const { data } = await supabase
      .from('listing')
      .select('*,listingImages(listing_id,url)')
      .eq('createdBy', user?.primaryEmailAddress.emailAddress)
      .eq('id', params.id)
    if (data) {
      console.log(data)
      setListing(data[0])
    }
    if (data?.length <= 0) {
      router.replace('/')
    }
  }

  const onSubmitHandler = async (formValue) => {
    setLoading(true)
    if (images?.length === 0) {
      setLoading(false)
      toast('Please add atleast 1 Image')
      return
    }

    const { data } = await supabase
      .from('listing')
      .update(formValue)
      .eq('id', params.id)
      .select()

    if (data) {
      console.log(data)
      toast('Listing updated and Published')
      setLoading(false)
      publishBtnHandler()
    }
    for (const image of images) {
      setLoading(true)
      const file = image
      const fileName = Date.now().toString()
      const fileExt = fileName.split('.').pop()
      const { error } = await supabase.storage
        .from('listingImages')
        .upload(`${fileName}`, file, {
          contentType: `image/${fileExt}`,
          upsert: false
        })

      if (error) {
        setLoading(false)
        toast('Error while uploading images')
      } else {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName
        const { data, error } = await supabase
          .from('listingImages')
          .insert([
            { url: imageUrl, listing_id: params?.id }
          ])
          .select()

        if (data) {
          setLoading(false)
        }
        if (error) {
          setLoading(false)
        }
      }
      setLoading(false)
    }
  }

  const publishBtnHandler = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('listing')
      .update({ active: true })
      .eq('id', params?.id)
      .select()

    if (data) {
      setLoading(false)
      toast('Listing published!')
    }
  }

  return (
        <div className='px-10 md:px-36 my-10'>
            <h2 className='font-bold text-2xl'>Saisissez quelques détails supplémentaires concernant votre annonce</h2>

            <Formik
                initialValues={{
                  type: '',
                  propertyType: '',
                  profileImage: user?.imageUrl,
                  fullName: user?.fullName
                }}
                onSubmit={(values) => {
                  console.log(values)
                  onSubmitHandler(values)
                }}
            >
                {({
                  values,
                  handleChange,
                  handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className='p-5 border rounded-lg shadow-md grid gap-7 mt-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                                    <div className='flex gap-2 flex-col'>

                                        <h2 className='text-gray-500'>Vous voulez le Louer ou le Vendre ?</h2>
                                        <RadioGroup defaultValue={listing?.type}
                                            onValueChange={(v) => values.type = v}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Sell" id="Sell" />
                                                <Label htmlFor="Sell" className="text-lg">Vendre</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Rent" id="Rent" />
                                                <Label htmlFor="Rent" className="text-lg">Louer</Label>
                                            </div>
                                        </RadioGroup>

                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Type de propriété</h2>
                                        <Select
                                            onValueChange={(e) => values.propertyType = e}
                                            name="propertyType"
                                            defaultValue={listing?.propertyType}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={listing?.propertyType ? listing?.propertyType : 'Choisissez le type de la propriété'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single Family House">Maison individuelle</SelectItem>
                                                <SelectItem value="Town House">Maison de ville</SelectItem>
                                                <SelectItem value="Condo">Copropriété</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Chambre à coucher</h2>
                                        <Input type="number" placeholder="Ex.2"
                                            defaultValue={listing?.bedroom}
                                            name="bedroom"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex gap-2 flex-col'>

                                        <h2 className='text-gray-500' >Salle de bains</h2>
                                        <Input type="number" placeholder="Ex.2" name="bathroom"
                                            onChange={handleChange}
                                            defaultValue={listing?.bathroom} />
                                    </div>
                                    <div className='flex gap-2 flex-col' >
                                        <h2 className='text-gray-500'>Intégré</h2>

                                        <Input type="number" placeholder="Ex.1900 Sq.ft"
                                            onChange={handleChange}
                                            defaultValue={listing?.builtIn} name="builtIn" />
                                    </div>

                                </div>
                                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Parking</h2>
                                        <Input type="number" placeholder="Ex.2" name="parking"
                                            onChange={handleChange}
                                            defaultValue={listing?.parking}
                                        />
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Taille du terrain (m²)</h2>
                                        <Input type="number" placeholder="" name="lotSize"
                                            onChange={handleChange}
                                            defaultValue={listing?.lotSize} />
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Surface (m²)</h2>
                                        <Input type="number" placeholder="Ex.1900" name="area"
                                            onChange={handleChange}
                                            defaultValue={listing?.area} />
                                    </div>

                                </div>
                                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Prix d'achat (FCFA)</h2>
                                        <Input type="number" placeholder="400000" name="price"
                                            onChange={handleChange}
                                            defaultValue={listing?.price} />
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Montant (FCFA/mois)</h2>
                                        <Input type="number"
                                            defaultValue={listing?.hoa} placeholder="100" onChange={handleChange}
                                            name="hoa" />
                                    </div>

                                </div>
                                <div className='grid  grid-cols-1  gap-10'>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Description</h2>
                                        <Textarea placeholder="" name="description"
                                            onChange={handleChange}
                                            defaultValue={listing?.description} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className='font-lg text-gray-500 my-2'>Télécharger des images de la propriété</h2>
                                    <FileUpload
                                        setImages={(value) => setImages(value)}
                                        imageList={listing.listingImages}
                                    />
                                </div>
                                <div className='flex gap-7 justify-end'>

                                    <Button disabled={loading} variant="outline" className="text-primary border-primary">
                                        {loading ? <Loader className='animate-spin' /> : 'Save'}
                                    </Button>

                                    {/* <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                        <Button type="button" disabled={loading} className="">
                                        {loading ? <Loader className='animate-spin' /> : 'Publish'}
                                    </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   Do you really want to publish the listing?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={()=>publishBtnHandler()} >
                                                    {loading?<Loader className='animate-spin'/>:'Continue'}
                                                    </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog> */}

                                </div>
                            </div>
                        </div>
                    </form>)}
            </Formik>
        </div>
  )
}

export default EditListing
