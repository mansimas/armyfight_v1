class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :fights, :dependent => :destroy
  validates :nickname, uniqueness: true
end
