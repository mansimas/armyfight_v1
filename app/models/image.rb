class Image < ActiveRecord::Base
  include ActionView::Helpers::NumberHelper

  def upload(params)
      random_nr = rand(1000..9999)
      image_name = random_nr.to_s + params[:file].original_filename
      write_file(image_name, params)
      self.name = image_name
      self.file_name = params[:file].original_filename
      self.size = number_to_human_size(params[:file].size, :precision => 5, :separator => '.')
      self.image_type = params[:file].content_type
      self.save!
  end

  def write_file(image_name, params)
    	FileUtils.mkdir_p('public/assets/images') unless File.directory?('public/assets/images')
    	File.open(Rails.root.join('public', 'assets/images', image_name), 'wb') do |file|
        	file.write(params[:file].read)
      end
  end

end
