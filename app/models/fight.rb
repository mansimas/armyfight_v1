class Fight < ActiveRecord::Base
	validates_presence_of :name
	validates_uniqueness_of :name
	belongs_to :user
	has_many :armies, :dependent => :destroy
	def to_param
	    name
	end
end
