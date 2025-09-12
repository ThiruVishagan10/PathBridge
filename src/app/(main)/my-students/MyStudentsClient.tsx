"use client";

import { getMyStudents, getStudentDetails } from '@/actions/alumni.action';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircleIcon, UserIcon, ExternalLinkIcon, CodeIcon, GraduationCapIcon, MapPinIcon, CalendarIcon, TableIcon, LayoutGridIcon, TrendingUpIcon, UsersIcon, MessageSquareIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Students = Awaited<ReturnType<typeof getMyStudents>>;
type Student = Students[0];

interface MyStudentsClientProps {
  students: Students;
}

export default function MyStudentsClient({ students }: MyStudentsClientProps) {
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    degree: '',
    year: '',
    department: '',
    skills: ''
  });
  const [sortBy, setSortBy] = useState('name');

  const handleFilter = () => {
    let filtered = [...students];
    
    if (filters.search) {
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.username.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.degree) {
      filtered = filtered.filter(s => s.degree?.toLowerCase().includes(filters.degree.toLowerCase()));
    }
    
    if (filters.department) {
      filtered = filtered.filter(s => s.department?.toLowerCase().includes(filters.department.toLowerCase()));
    }
    
    if (filters.skills) {
      const searchTerm = filters.skills.toLowerCase().trim();
      filtered = filtered.filter(s => 
        s.skills && Array.isArray(s.skills) && 
        s.skills.some(skill => 
          typeof skill === 'string' && skill.toLowerCase().includes(searchTerm)
        )
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'followers':
          return b._count.followers - a._count.followers;
        default:
          return 0;
      }
    });
    
    setFilteredStudents(filtered);
  };

  const openStudentModal = async (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const analytics = {
    totalStudents: students.length,
    totalPosts: students.reduce((sum, s) => sum + s._count.posts, 0),
    avgFollowers: Math.round(students.reduce((sum, s) => sum + s._count.followers, 0) / students.length || 0),
    topSkills: students.flatMap(s => s.skills || []).reduce((acc: any, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">My Students</h1>
            <p className="text-muted-foreground">Students from your institution</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters & Sorting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="Search students"
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({...filters, search: e.target.value});
                    handleFilter();
                  }}
                />
                <Input
                  placeholder="Filter by degree"
                  value={filters.degree}
                  onChange={(e) => {
                    setFilters({...filters, degree: e.target.value});
                    handleFilter();
                  }}
                />
                <Input
                  placeholder="Filter by department"
                  value={filters.department}
                  onChange={(e) => {
                    setFilters({...filters, department: e.target.value});
                    handleFilter();
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Filter by skills"
                  value={filters.skills}
                  onChange={(e) => {
                    const newFilters = {...filters, skills: e.target.value};
                    setFilters(newFilters);
                    
                    // Apply filter immediately
                    let filtered = [...students];
                    
                    if (newFilters.search) {
                      filtered = filtered.filter(s => 
                        s.name?.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                        s.username.toLowerCase().includes(newFilters.search.toLowerCase())
                      );
                    }
                    
                    if (newFilters.degree) {
                      filtered = filtered.filter(s => s.degree?.toLowerCase().includes(newFilters.degree.toLowerCase()));
                    }
                    
                    if (newFilters.department) {
                      filtered = filtered.filter(s => s.department?.toLowerCase().includes(newFilters.department.toLowerCase()));
                    }
                    
                    if (newFilters.skills) {
                      const searchTerm = newFilters.skills.toLowerCase().trim();
                      filtered = filtered.filter(s => 
                        s.skills && Array.isArray(s.skills) && 
                        s.skills.some(skill => 
                          typeof skill === 'string' && skill.toLowerCase().includes(searchTerm)
                        )
                      );
                    }
                    
                    // Sort
                    filtered.sort((a, b) => {
                      switch (sortBy) {
                        case 'name':
                          return (a.name || '').localeCompare(b.name || '');
                        case 'recent':
                          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        case 'followers':
                          return b._count.followers - a._count.followers;
                        default:
                          return 0;
                      }
                    });
                    
                    setFilteredStudents(filtered);
                  }}
                />
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  handleFilter();
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="recent">Recent Activity</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleFilter}>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* View Toggle */}
          <Tabs defaultValue="grid" className="mb-6">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <LayoutGridIcon className="w-4 h-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="w-4 h-4" />
                Table View
              </TabsTrigger>
            </TabsList>

            {/* Grid View */}
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Link href={`/profile/${student.username}`} className="flex flex-col items-center">
                          <Avatar className="w-16 h-16 mb-4">
                            <AvatarImage src={student.image || '/avatar.png'} />
                          </Avatar>
                          
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">{student.name}</h3>
                          <p className="text-muted-foreground text-sm">@{student.username}</p>
                        </Link>
                        
                        {student.degree && (
                          <div className="flex items-center mt-2 text-sm text-primary">
                            <GraduationCapIcon className="w-4 h-4 mr-1" />
                            {student.degree}
                            {student.department && ` - ${student.department}`}
                          </div>
                        )}
                        
                        {student.institution && (
                          <p className="text-sm text-muted-foreground mt-1">{student.institution}</p>
                        )}
                        
                        {student.yearOfStudy && (
                          <p className="text-sm text-muted-foreground">{student.yearOfStudy}</p>
                        )}

                        {/* Skills */}
                        {student.skills && Array.isArray(student.skills) && student.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3 justify-center">
                            {student.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                          <span>{student._count.posts} posts</span>
                          <span>{student._count.followers} followers</span>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/messages?user=${student.username}`}>
                              <MessageCircleIcon className="w-4 h-4 mr-1" />
                              Message
                            </Link>
                          </Button>
                          <Button variant="secondary" size="sm">
                            <StarIcon className="w-4 h-4 mr-1" />
                            Refer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Table View */}
            <TabsContent value="table">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4">Student</th>
                          <th className="p-4">Program</th>
                          <th className="p-4">Skills</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              <Link href={`/profile/${student.username}`} className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={student.image || '/avatar.png'} />
                                </Avatar>
                                <div>
                                  <p className="font-medium hover:text-primary transition-colors">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">@{student.username}</p>
                                </div>
                              </Link>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{student.degree || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">{student.department || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
                                  <>
                                    {student.skills.slice(0, 2).map((skill, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {student.skills.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{student.skills.length - 2}
                                      </Badge>
                                    )}
                                  </>
                                ) : 'N/A'}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/messages?user=${student.username}`}>Message</Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                  Refer
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-6">
            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Total Students</span>
                  </div>
                  <span className="font-semibold">{analytics.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Total Posts</span>
                  </div>
                  <span className="font-semibold">{analytics.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Avg Followers</span>
                  </div>
                  <span className="font-semibold">{analytics.avgFollowers}</span>
                </div>
              </CardContent>
            </Card>

            {/* Mutual Students */}
            <Card>
              <CardHeader>
                <CardTitle>Mutual Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredStudents.filter(student => student.followers && student.followers.length > 0).slice(0, 10).map((student) => (
                    <div key={student.id} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.image || '/avatar.png'} />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{student.username}</p>
                      </div>
                    </div>
                  ))}
                  {filteredStudents.filter(student => student.followers && student.followers.length > 0).length > 10 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{filteredStudents.filter(student => student.followers && student.followers.length > 0).length - 10} more students
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedStudent.image || '/avatar.png'} />
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                  <p className="text-muted-foreground">@{selectedStudent.username}</p>
                  <div className="flex gap-2 mt-2">
                    {selectedStudent.linkedinUrl && (
                      <a href={selectedStudent.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                    {selectedStudent.githubUrl && (
                      <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer">
                        <CodeIcon className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {selectedStudent.bio && (
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-muted-foreground">{selectedStudent.bio}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Education</h3>
                <div className="space-y-2">
                  {selectedStudent.institution && (
                    <div className="flex items-center">
                      <GraduationCapIcon className="w-4 h-4 mr-2" />
                      {selectedStudent.institution}
                    </div>
                  )}
                  {selectedStudent.degree && (
                    <p className="text-sm text-muted-foreground ml-6">
                      {selectedStudent.degree}
                      {selectedStudent.department && ` - ${selectedStudent.department}`}
                    </p>
                  )}
                  {selectedStudent.yearOfStudy && (
                    <p className="text-sm text-muted-foreground ml-6">{selectedStudent.yearOfStudy}</p>
                  )}
                </div>
              </div>

              {selectedStudent.skills && Array.isArray(selectedStudent.skills) && selectedStudent.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.interests && Array.isArray(selectedStudent.interests) && selectedStudent.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.projects && Array.isArray(selectedStudent.projects) && selectedStudent.projects.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Projects</h3>
                  <div className="space-y-2">
                    {selectedStudent.projects.map((project: any, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{project.title || `Project ${index + 1}`}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.achievements && Array.isArray(selectedStudent.achievements) && selectedStudent.achievements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Achievements</h3>
                  <div className="space-y-2">
                    {selectedStudent.achievements.map((achievement: any, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{achievement.title || achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button className="flex-1" asChild>
                  <Link href={`/profile/${selectedStudent.username}`}>
                    View Full Profile
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/messages?user=${selectedStudent.username}`}>
                    Message Student
                  </Link>
                </Button>
                <Button variant="secondary" className="flex-1">
                  <StarIcon className="w-4 h-4 mr-1" />
                  Refer Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}