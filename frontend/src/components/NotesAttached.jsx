import { FileText, Download, Eye, Calendar } from 'lucide-react';

export function NotesAttached() {
  const notes = [
    {
      id: '1',
      title: 'Matrix Operations Summary',
      course: 'Advanced Mathematics',
      date: 'Jan 27, 2026',
      pages: 5,
      size: '2.3 MB',
      color: 'purple'
    },
    {
      id: '2',
      title: 'Quantum Mechanics - Wave Functions',
      course: 'Physics',
      date: 'Jan 25, 2026',
      pages: 8,
      size: '3.1 MB',
      color: 'yellow'
    },
    {
      id: '3',
      title: 'Binary Trees & Traversal',
      course: 'Computer Science',
      date: 'Jan 24, 2026',
      pages: 6,
      size: '1.9 MB',
      color: 'purple'
    },
    {
      id: '4',
      title: 'Integration Techniques',
      course: 'Advanced Mathematics',
      date: 'Jan 22, 2026',
      pages: 4,
      size: '1.5 MB',
      color: 'yellow'
    },
    {
      id: '5',
      title: 'Algorithm Complexity Analysis',
      course: 'Computer Science',
      date: 'Jan 20, 2026',
      pages: 7,
      size: '2.7 MB',
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notes & Resources</h2>
        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
          {notes.length} Files
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {notes.map((note) => (
          <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-lg ${
                  note.color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'
                }`}>
                  <FileText className={note.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'} size={20} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{note.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{note.course}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      <span>{note.date}</span>
                    </div>
                    <span>{note.pages} pages</span>
                    <span>{note.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye size={18} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                  <Download size={18} className="text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors">
        + Upload New Note
      </button>
    </div>
  );
}
