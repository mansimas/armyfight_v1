class Army < ActiveRecord::Base
	belongs_to :fight
	has_many :targets, :dependent => :destroy

	def create_army(params)
		self.unit_name = params[:army][:unit]
		self.hp_from = params[:army][:stats][:hp_from]
		self.hp_to = params[:army][:stats][:hp_to]
		self.dmg_from = params[:army][:stats][:dmg_from]
		self.dmg_to = params[:army][:stats][:dmg_to]
		self.def_inf_from = params[:army][:stats][:def_inf_from]
		self.def_inf_to = params[:army][:stats][:def_inf_to]
		self.def_hors_from = params[:army][:stats][:def_hors_from]
		self.def_hors_to = params[:army][:stats][:def_hors_to]
		self.def_arch_from = params[:army][:stats][:def_arch_from]
		self.def_arch_to = params[:army][:stats][:def_arch_to]
		self.speed = params[:army][:stats][:speed]
		self.unit_type = params[:army][:stats][:type]
		self.columns = params[:army][:column]
		self.rows = params[:army][:row]
		self.x_pos = params[:army][:x]
		self.y_pos = params[:army][:y]
		self.fight_id = params[:fight_id]
		self.direction = params[:direction]
	end

	def create_targets(params)
		if params[:army][:targets]
			params[:army][:targets].each do |t|
				target = Target.new(
					:army_id => self.id, 
					:x => t['x'], 
					:y => t['y'],
					:stay_time => t['time'])
				target.save!
			end
		end
	end

end