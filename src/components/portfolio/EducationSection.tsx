import { motion } from 'framer-motion';

interface EducationSectionProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
}

export default function EducationSection({ formData, handleInputChange }: EducationSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <label className="block text-sm font-medium mb-2">Full Name *</label>
        <input
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
          required
        />
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
          required
        />
      </motion.div>
    </div>
  );
}