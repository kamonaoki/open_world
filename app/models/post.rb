class Post < ApplicationRecord

  validates :title, presence: true
  validates :image, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true
  
  has_many :comments
  has_one_attached :image
  geocoded_by :address
  after_validation :geocode, if: :address_changed?
  belongs_to :user
end
