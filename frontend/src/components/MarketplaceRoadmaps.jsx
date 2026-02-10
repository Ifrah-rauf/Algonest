import { ShoppingCart, Star, TrendingUp } from 'lucide-react';

const marketplaceRoadmaps = [
  {
    id: 1,
    title: 'Advanced Algorithm Design',
    author: 'Dr. Johnson',
    price: '$79',
    rating: 4.9,
    reviews: 456,
    students: 2340,
    category: 'Computer Science',
    trending: true,
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    author: 'Emma Wilson',
    price: '$54',
    rating: 4.8,
    reviews: 324,
    students: 1890,
    category: 'Design',
    trending: false,
  },
  {
    id: 3,
    title: 'Blockchain Development',
    author: 'Prof. Martinez',
    price: '$89',
    rating: 4.7,
    reviews: 289,
    students: 1520,
    category: 'Web3',
    trending: true,
  },
  {
    id: 4,
    title: 'Cloud Architecture AWS',
    author: 'Sarah Chen',
    price: '$69',
    rating: 4.9,
    reviews: 512,
    students: 2890,
    category: 'Cloud',
    trending: false,
  },
  {
    id: 5,
    title: 'Game Development Unity',
    author: 'Mike Anderson',
    price: '$64',
    rating: 4.6,
    reviews: 234,
    students: 1120,
    category: 'Game Dev',
    trending: false,
  },
  {
    id: 6,
    title: 'Cybersecurity Essentials',
    author: 'Dr. Thompson',
    price: '$74',
    rating: 4.8,
    reviews: 398,
    students: 1670,
    category: 'Security',
    trending: true,
  },
];

export function MarketplaceRoadmaps() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Marketplace</h2>
        <p className="text-gray-600 mt-2">Discover and purchase roadmaps from other educators</p>
      </div>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search roadmaps..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          <option>All Categories</option>
          <option>Computer Science</option>
          <option>Design</option>
          <option>Web3</option>
          <option>Cloud</option>
          <option>Security</option>
        </select>
        <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          <option>Sort by: Popular</option>
          <option>Sort by: Price</option>
          <option>Sort by: Rating</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceRoadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {roadmap.trending && (
                <div className="flex items-center gap-2 text-yellow-600 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Trending</span>
                </div>
              )}
              
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
                {roadmap.category}
              </span>
              
              <h3 className="font-bold text-gray-900 mb-2">{roadmap.title}</h3>
              <p className="text-sm text-gray-600 mb-4">by {roadmap.author}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">{roadmap.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({roadmap.reviews} reviews)</span>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                {roadmap.students.toLocaleString()} students enrolled
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-2xl font-bold text-gray-900">{roadmap.price}</span>
                <button className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-semibold">
                  <ShoppingCart className="w-4 h-4" />
                  Purchase
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
