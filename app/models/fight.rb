class Fight < ActiveRecord::Base
	validates_presence_of :name
	validates_uniqueness_of :name
	belongs_to :user
	has_many :map_elements, :dependent => :destroy
	has_many :armies, :dependent => :destroy
end
