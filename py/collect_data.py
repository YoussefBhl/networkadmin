from netmiko import ConnectHandler
import textfsm
import json



#try to connect to any device to show the device status on teh screen
# in : device's ip,user name and password
#out : device's status (active or deactive)
def try_to_connect(ip,username,password):
    try:
        ssh_connection = ConnectHandler(
            ip=ip,
            username=username,
            password=password,
            device_type="cisco_ios",
            timeout=2
        )
        ssh_connection.disconnect()
        return "active"
    except Exception as e:
            return "deactive"


#run the switch command (show vlan and show int)       
# in: siwtch' info and vlan command inter command (we need to pass the comm cuz we have two differnet switchs)
#out: the command output(like CLI result)
def run_cli_command(ip, username, password,_model,commandsList):
    # establish a connection to the device
    ssh_connection = ConnectHandler(
        ip=ip,
        username=username,
        password=password,
        device_type=_model
    )
    outputCLI = []
    for i in commandsList:
        outputCLI.append(ssh_connection.send_command(i, delay_factor=2))
    # close SSH connection
    ssh_connection.disconnect()
    #prin   t result
    return outputCLI

#we need to purse the output command (because we need to show for the user (navigator))
#in : input (which is the command output) nad template which uses regular expression (for more info search for textfsm)
def perse_results(input,temp):
    template = open(temp)
    re_table = textfsm.TextFSM(template)
    fsm_results = re_table.ParseText(input)
    header = []
    for s in re_table.header:
        header.append(s)
    counter = 0
    output = []
    for row in fsm_results:
        i = 0
        data = {}
        for s in row:
            data[header[i]] = s
            i = i +1
        counter += 1
        output.append(data)
    json_data = json.dumps(output)
    return output