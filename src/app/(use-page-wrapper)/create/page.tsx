// File: app/receptek/create/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookText, ListChecks, CookingPot, BarChart3, Info, PlusCircle, Upload, XCircle, Star, DollarSign, ChefHat, Soup, Flame } from 'lucide-react';

// Define the types for our form state
interface Ingredient {
  category: string;
  name: string;
  quantity: string;
  unit: string;
  store?: string;
  onSale?: boolean;
}

interface PreparationStep {
  title: string;
  description: string;
  images: (File | string)[];
}

const difficultyLevels = [
    { label: 'Könnyű', icon: <Soup size={20} /> },
    { label: 'Közepes', icon: <ChefHat size={20} /> },
    { label: 'Nehéz', icon: <Flame size={20} /> },
];

const CreateRecipePage = () => {
  const router = useRouter();

  // --- MOCK USER AUTH STATE ---
  // In a real app, this would come from a context or auth hook
  const [isRegisteredUser, setIsRegisteredUser] = useState(true);

  // State for all form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  
  const [price, setPrice] = useState('');

  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [recipeYield, setRecipeYield] = useState('');
  const [difficulty, setDifficulty] = useState('Könnyű');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { category: 'A tésztához:', name: '', quantity: '', unit: '', store: '', onSale: false }
  ]);
  const [ingredientsNote, setIngredientsNote] = useState('');
  
  const [preparationSteps, setPreparationSteps] = useState<PreparationStep[]>([
      { title: '', description: '', images: [] }
  ]);

  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [nutritionNote, setNutritionNote] = useState('');

  const [galleryImages, setGalleryImages] = useState<(File | string)[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Effect for auto-calculating total time ---
  useEffect(() => {
      const prep = parseInt(prepTime, 10) || 0;
      const cook = parseInt(cookTime, 10) || 0;
      const total = prep + cook;
      setTotalTime(total > 0 ? total.toString() : '');
  }, [prepTime, cookTime]);


  // --- Handlers for Ingredients ---
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | boolean) => {
    const newIngredients = [...ingredients];
    (newIngredients[index] as any)[field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    const lastIngredient = ingredients[ingredients.length - 1];
    setIngredients([...ingredients, { category: lastIngredient?.category || '', name: '', quantity: '', unit: '', store: '', onSale: false }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  
  // --- Handlers for Preparation Steps ---
  const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
      const newSteps = [...preparationSteps];
      newSteps[index][field] = value;
      setPreparationSteps(newSteps);
  };

  const addStep = () => {
      setPreparationSteps([...preparationSteps, { title: '', description: '', images: [] }]);
  };

  const removeStep = (index: number) => {
      setPreparationSteps(preparationSteps.filter((_, i) => i !== index));
  };

  const handleStepImageChange = (stepIndex: number, files: FileList | null) => {
      if(files){
          const newSteps = [...preparationSteps];
          const currentImages = newSteps[stepIndex].images;
          newSteps[stepIndex].images = [...currentImages, ...Array.from(files)];
          setPreparationSteps(newSteps);
      }
  };
  
  const removeStepImage = (stepIndex: number, imgIndex: number) => {
    const newSteps = [...preparationSteps];
    newSteps[stepIndex].images = newSteps[stepIndex].images.filter((_, i) => i !== imgIndex);
    setPreparationSteps(newSteps);
  };

  // --- Handlers for Image Uploads ---
  const handleBannerImageChange = (files: FileList | null) => {
      if(files && files[0]){
          setBannerImage(files[0]);
          setBannerImageUrl(URL.createObjectURL(files[0]));
      }
  }
  
  const handleGalleryImageChange = (files: FileList | null) => {
      if(files){
          setGalleryImages([...galleryImages, ...Array.from(files)]);
      }
  }

  const removeGalleryImage = (index: number) => {
      setGalleryImages(galleryImages.filter((_, i) => i !== index));
  }


  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisteredUser === false && price) {
        setError("A recept mentéséhez árral be kell jelentkeznie.");
        return;
    }
    setIsSubmitting(true);
    setError(null);

    // NOTE: This is where you would handle the actual upload to Strapi.
    // 1. Upload all images (banner, step images, gallery) to Strapi's media library to get their IDs.
    // 2. Structure the rest of the data into the JSON format your Strapi 'receptek' collection type expects.
    // 3. Send a POST request to your Strapi API endpoint (e.g., /api/recepteks).

    try {
        // --- Mock Strapi submission ---
        const formData = {
            title, description, author, tags: tags.split(',').map(t => t.trim()),
            prepTime, cookTime, totalTime, recipeYield, difficulty, price,
            ingredients, ingredientsNote,
            preparationSteps: preparationSteps.map(step => ({
                ...step,
                images: step.images.map(img => (typeof img === 'string' ? img : img.name)) // just using names for demo
            })),
            protein, carbs, fat, nutritionNote,
            bannerImage: bannerImage?.name,
            galleryImages: galleryImages.map(img => (typeof img === 'string' ? img : img.name))
        };

        console.log("Submitting to Strapi:", JSON.stringify(formData, null, 2));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // On success:
        alert("Recept sikeresen létrehozva!");
        router.push('/receptek'); // Redirect to recipes list or the new recipe page

    } catch (err) {
        console.error("Submission failed", err);
        setError("Hiba történt a recept mentése során. Kérlek, próbáld újra.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Helper to render image previews
  const renderImagePreview = (image: File | string) => {
      if (typeof image === 'string') {
          return image; // This would be a URL from an existing source if you were editing
      }
      return URL.createObjectURL(image);
  };


  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Oszd meg a kedvenc recepted</h1>
            <p className="mt-4 text-lg text-gray-600">Töltsd ki az alábbi űrlapot, és inspirálj másokat is a konyhában!</p>
        </div>
        
        <div className="flex justify-center mb-4">
             <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-medium text-gray-900">Vendég</span>
                <div className="relative">
                    <input type="checkbox" checked={isRegisteredUser} onChange={() => setIsRegisteredUser(!isRegisteredUser)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Regisztrált felhasználó</span>
            </label>
        </div>


        <form onSubmit={handleSubmit} className="space-y-10">
          {/* --- Section 1: Basic Info --- */}
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80">
            <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center"><Info className="mr-3"/>Alapinformációk</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Recept címe</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Rövid leírás</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Szerző</label>
                        <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Címkék (vesszővel elválasztva)</label>
                        <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Borítókép</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="banner-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500">
                                        <span>Fájl feltöltése</span>
                                        <input id="banner-upload" name="banner-upload" type="file" className="sr-only" onChange={e => handleBannerImageChange(e.target.files)} accept="image/*"/>
                                    </label>
                                    <p className="pl-1">vagy húzd ide</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF max 10MB</p>
                            </div>
                        </div>
                    </div>
                    {bannerImageUrl && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image src={bannerImageUrl} alt="Borítókép előnézet" layout="fill" className="object-cover"/>
                             <button type="button" onClick={() => { setBannerImage(null); setBannerImageUrl(''); }} className="absolute top-2 right-2 bg-white/70 rounded-full p-1 text-gray-700 hover:text-red-600 transition-colors">
                                <XCircle className="h-6 w-6"/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>
          
          {/* --- Section 2: Details & Timing --- */}
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80">
              <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center"><Info className="mr-3"/>Részletek és Időzítés</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                      <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">Előkészítési idő (perc)</label>
                      <input type="number" id="prepTime" value={prepTime} onChange={e => setPrepTime(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">Főzési/Sütési idő (perc)</label>
                      <input type="number" id="cookTime" value={cookTime} onChange={e => setCookTime(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="totalTime" className="block text-sm font-medium text-gray-700 mb-1">Teljes idő</label>
                       <div className="mt-1 flex items-center h-10 px-3 w-full rounded-lg bg-gray-100 text-gray-600">
                          {totalTime ? `${totalTime} perc` : 'N/A'}
                      </div>
                  </div>
                   <div className="col-span-2 md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nehézségi szint</label>
                      <div className="flex space-x-2 md:space-x-4">
                          {difficultyLevels.map(level => (
                               <button 
                                  key={level.label}
                                  type="button"
                                  onClick={() => setDifficulty(level.label)}
                                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${difficulty === level.label ? 'bg-pink-600 border-pink-600 text-white shadow-md' : 'bg-white border-gray-300 text-gray-700 hover:border-pink-400'}`}
                                >
                                  {level.icon}
                                  <span className="ml-2 font-semibold">{level.label}</span>
                               </button>
                          ))}
                      </div>
                  </div>
                   <div className="col-span-1">
                      <label htmlFor="recipeYield" className="block text-sm font-medium text-gray-700 mb-1">Adag</label>
                      <input type="text" id="recipeYield" value={recipeYield} onChange={e => setRecipeYield(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder="pl. 4 fő" />
                  </div>
                   <div className="col-span-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Recept Ára (Ft)</label>
                        {isRegisteredUser ? (
                             <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder="pl. 2500" />
                            </div>
                        ) : (
                            <div className="mt-1 text-sm p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                                Az ár megadásához <button type="button" className="font-bold underline">jelentkezz be</button>.
                            </div>
                        )}
                  </div>
              </div>
          </div>

          {/* --- Section 3: Ingredients --- */}
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80">
            <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center"><ListChecks className="mr-3"/>Hozzávalók</h2>
            <div className="space-y-6">
                {ingredients.map((ing, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 relative bg-gray-50/50">
                         <button type="button" onClick={() => removeIngredient(index)} className="absolute -top-3 -right-3 bg-white rounded-full text-gray-500 hover:text-red-600 transition-colors">
                            <XCircle className="h-6 w-6"/>
                         </button>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                             <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-600">Kategória</label>
                                <input type="text" value={ing.category} onChange={e => handleIngredientChange(index, 'category', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder="pl. A tésztához"/>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-medium text-gray-600">Hozzávaló neve</label>
                                <input type="text" value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder="pl. Finomliszt"/>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600">Mennyiség</label>
                                <input type="text" value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder="pl. 25"/>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-600">Egység</label>
                                <input type="text" value={ing.unit} onChange={e => handleIngredientChange(index, 'unit', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder="pl. dkg"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-600">Bolt (opcionális)</label>
                                <input type="text" value={ing.store} onChange={e => handleIngredientChange(index, 'store', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder="pl. Lidl"/>
                            </div>
                             <div className="flex items-end pb-1">
                                <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={!!ing.onSale} onChange={e => handleIngredientChange(index, 'onSale', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 mr-2"/>
                                    Akciós?
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addIngredient} className="mt-6 flex items-center text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors">
                <PlusCircle className="h-5 w-5 mr-2" /> Új hozzávaló
            </button>
             <div className="mt-6">
                <label htmlFor="ingredientsNote" className="block text-sm font-medium text-gray-700 mb-1">Megjegyzés a hozzávalókhoz</label>
                <textarea id="ingredientsNote" value={ingredientsNote} onChange={e => setIngredientsNote(e.target.value)} rows={2} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
            </div>
          </div>
          
           {/* --- Section 4: Preparation Steps --- */}
           <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center"><CookingPot className="mr-3"/>Elkészítés</h2>
                <div className="space-y-8">
                    {preparationSteps.map((step, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50/50">
                             <button type="button" onClick={() => removeStep(index)} className="absolute -top-3 -right-3 bg-white rounded-full text-gray-500 hover:text-red-600 transition-colors">
                                <XCircle className="h-6 w-6"/>
                             </button>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-xl mr-4 shrink-0">{index + 1}</div>
                                <div className="w-full">
                                    <label className="block text-xs font-medium text-gray-600">Lépés címe</label>
                                    <input type="text" value={step.title} onChange={e => handleStepChange(index, 'title', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" placeholder={`pl. Tészta összeállítása`} />
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-600">Leírás</label>
                                <textarea value={step.description} onChange={e => handleStepChange(index, 'description', e.target.value)} rows={4} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Képek ehhez a lépéshez</label>
                                 <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                     {step.images.map((img, imgIdx) => (
                                         <div key={imgIdx} className="relative aspect-square">
                                             <Image src={renderImagePreview(img)} alt={`lépés ${index+1} kép ${imgIdx+1}`} layout="fill" className="rounded-lg object-cover"/>
                                             <button type="button" onClick={() => removeStepImage(index, imgIdx)} className="absolute top-1 right-1 bg-white/70 rounded-full p-0.5 text-gray-700 hover:text-red-600 transition-colors">
                                                <XCircle className="h-5 w-5"/>
                                            </button>
                                         </div>
                                     ))}
                                     <label htmlFor={`step-img-upload-${index}`} className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-50/80 hover:border-pink-400 hover:text-pink-500 cursor-pointer transition-colors">
                                        <PlusCircle className="h-8 w-8"/>
                                        <span className="mt-1 text-xs">Kép hozzáadása</span>
                                        <input id={`step-img-upload-${index}`} type="file" multiple className="sr-only" onChange={e => handleStepImageChange(index, e.target.files)} accept="image/*"/>
                                    </label>
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addStep} className="mt-6 flex items-center text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors">
                    <PlusCircle className="h-5 w-5 mr-2" /> Új lépés hozzáadása
                </button>
           </div>
           
           {/* --- Section 5: Nutrition --- */}
           <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center"><BarChart3 className="mr-3"/>Tápérték (opcionális)</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                        <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">Fehérje (g)</label>
                        <input type="number" id="protein" value={protein} onChange={e => setProtein(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">Szénhidrát (g)</label>
                        <input type="number" id="carbs" value={carbs} onChange={e => setCarbs(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">Zsír (g)</label>
                        <input type="number" id="fat" value={fat} onChange={e => setFat(e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                    </div>
                 </div>
                 <div className="mt-6">
                    <label htmlFor="nutritionNote" className="block text-sm font-medium text-gray-700 mb-1">Megjegyzés a tápértékhez</label>
                    <textarea id="nutritionNote" value={nutritionNote} onChange={e => setNutritionNote(e.target.value)} rows={2} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm" />
                </div>
           </div>

           {/* --- Section 6: Gallery --- */}
           <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center">Galéria</h2>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">További képek a recepthez</label>
                     <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                         {galleryImages.map((img, imgIdx) => (
                             <div key={imgIdx} className="relative aspect-square">
                                 <Image src={renderImagePreview(img)} alt={`galéria kép ${imgIdx+1}`} layout="fill" className="rounded-lg object-cover"/>
                                 <button type="button" onClick={() => removeGalleryImage(imgIdx)} className="absolute top-1 right-1 bg-white/70 rounded-full p-0.5 text-gray-700 hover:text-red-600 transition-colors">
                                    <XCircle className="h-5 w-5"/>
                                </button>
                             </div>
                         ))}
                         <label htmlFor="gallery-upload" className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-50/80 hover:border-pink-400 hover:text-pink-500 cursor-pointer transition-colors">
                            <PlusCircle className="h-8 w-8"/>
                            <span className="mt-1 text-xs">Kép hozzáadása</span>
                            <input id="gallery-upload" type="file" multiple className="sr-only" onChange={e => handleGalleryImageChange(e.target.files)} accept="image/*"/>
                        </label>
                     </div>
                </div>
           </div>

          {/* --- Submission Button --- */}
          <div className="pt-5">
            <div className="flex justify-end items-center">
             {error && <p className="text-red-600 text-sm mr-4">{error}</p>}
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                Mégse
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-400 transition-colors"
              >
                {isSubmitting ? 'Mentés...' : 'Recept mentése'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateRecipePage;
