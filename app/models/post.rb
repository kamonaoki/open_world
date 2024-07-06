class Post < ApplicationRecord
  has_one_attached :image
  geocoded_by :address
  after_validation :geocode, if: :address_changed?
  belongs_to :user
end
