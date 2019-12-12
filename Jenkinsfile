pipeline {
    agent any

    stages {
        stage('Testing Environment') {
	  when {
		expression {
			env.BRANCH_NAME=='developer'
		}
	}
            steps {
            echo "Testing"
		sh 'cp /home/manager/terraform-azure/config.json src/'
		sh '. /home/manager/terraform-azure/ansible/ENV_VARIABLES.sh'
		sh 'docker image build --build-arg ENVIRON1="testing" -t="51.140.99.70:5000/sfia-roles:testing" .'
                sh 'docker push 51.140.99.70:5000/sfia-roles:testing'
		sh '/home/manager/terraform-azure/backEndUpdate.sh'
                }
            }


        stage('Staging') {
	  when {
		expression {
			env.BRANCH_NAME=='staging'
		}
	}
            steps {
		echo "staging"
		sh 'cp /home/manager/terraform-azure/config.json src/'
		sh '. /home/manager/terraform-azure/ansible/ENV_VARIABLES.sh'
		sh 'docker image build --build-arg ENVIRON1="staging" -t="51.140.99.70:5000/sfia-roles:staging" .'
                sh 'docker push 51.140.99.70:5000/sfia-roles:staging' 
		sh '/home/manager/terraform-azure/backEndUpdate.sh'
                } 
            }


      stage('Production') {
	when {
		expression {
			env.BRANCH_NAME=='master'
		}
	}
            steps {
		echo "production"
		sh 'cp /home/manager/terraform-azure/config.json src/'
		sh '. /home/manager/terraform-azure/ansible/ENV_VARIABLES.sh'
                sh 'docker image build --build-arg ENVIRON1="production" -t="51.140.99.70:5000/sfia-roles:production" .'
                sh 'docker push 51.140.99.70:5000/sfia-roles:production' 
		sh '/home/manager/terraform-azure/backEndUpdate.sh'
            }
        }
}
}
