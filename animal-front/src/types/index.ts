// 通用响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface UserCertificationRecord {
  id: number
  userId: number
  username?: string
  nickname?: string
  phone?: string
  email?: string
  certified?: boolean
  idCard?: string
  idCardFrontUrl?: string
  idCardBackUrl?: string
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  rejectReason?: string
  reviewerId?: number
  reviewerName?: string
  reviewTime?: string
  createTime?: string
  updateTime?: string
}

// 分页响应
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 用户相关
export interface User {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  role: string
  status: number
  createdTime?: string
  updatedTime?: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  email: string
  phone?: string
}

// 宠物相关
export interface Pet {
  id: number
  name: string
  category: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other'
  breed: string
  age: number
  gender: number
  color?: string
  weight?: number
  description?: string
  personality?: string
  healthStatus: 'healthy' | 'sick' | 'injured' | 'recovering'
  adoptionStatus: 'available' | 'pending' | 'adopted'
  adoptionStatusText?: string
  adoptedBy?: number
  images?: string[]
  coverImage?: string
  location?: string
  createdTime?: string
  updatedTime?: string
}

export interface PetQuery {
  name?: string
  category?: string
  adoptionStatus?: string
  healthStatus?: string
  minAge?: number
  maxAge?: number
  gender?: string | number
  current: number
  size: number
}

// 领养申请相关
export interface AdoptionApplication {
  id: number
  applicationNo?: string
  petId: number
  petName?: string
  petCoverImage?: string
  petCategory?: string
  petCategoryText?: string
  petGender?: number
  petAdoptionStatus?: string
  petAdoptionStatusText?: string
  userId: number
  applicantUsername?: string
  applicantNickname?: string
  applicantAvatar?: string
  applicantPhone?: string
  applicantEmail?: string
  applicantAddress?: string
  applicantRole?: string
  applicantCertified?: boolean
  applicantHasExperience?: boolean
  reason?: string
  familyInfo?: string
  careplan?: string
  additionalInfo?: string
  contactPhone?: string
  contactAddress?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  statusText?: string
  reviewComment?: string
  reviewTime?: string
  reviewerId?: number
  reviewerName?: string
  createTime?: string
  updateTime?: string
}

export interface ApplicationForm {
  petId: number
  applicantName: string
  applicantPhone: string
  applicantAddress: string
  applicantJob?: string
  housingType?: string
  hasExperience: boolean
  reason: string
}

// 文章相关
export interface Article {
  id?: number
  title: string
  content: string
  category: 'GUIDE' | 'STORY'
  summary?: string
  coverImage?: string
  author?: string
  guideCategory?: string
  tags?: string[]
  viewCount?: number
  likeCount?: number
  favoriteCount?: number
  liked?: boolean
  favorited?: boolean
  publishDate?: string
  publishTime?: string
  createdTime?: string
  updatedTime?: string
}

export interface ArticleCategoryOption {
  value: string
  label: string
}

// 收藏相关
export interface Favorite {
  id: number
  userId: number
  petId: number
  pet?: Pet
  createdTime?: string
}

// 聊天消息相关
export interface ChatMessage {
  id: number
  sessionId: number
  senderId: number
  senderName?: string
  senderAvatar?: string
  content: string
  messageType: 'TEXT' | 'IMAGE' | 'FILE'
  isRead: boolean
  createdTime?: string
}

export interface ChatSession {
  id: number
  userId: number
  username?: string
  userAvatar?: string
  sessionType: 'AI' | 'HOUSEKEEPER'
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  createdTime?: string
}

// 统计数据
export interface Statistics {
  totalPets: number
  availablePets: number
  adoptedPets: number
  pendingApplications: number
  totalUsers: number
  todayVisits: number
}

