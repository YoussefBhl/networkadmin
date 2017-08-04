from netmiko import ConnectHandler
import textfsm
import json
#import manuf
def try_to_connect(ip,username,password):
    try:
        ssh_connection = ConnectHandler(
            device_type='cisco_ios',
            ip=ip,
            username=username,
            password=password,
            timeout = .1
        )
        return "active"
    except Exception as e:
            return "deactive"
        
def run_command_cli(ip, username, password,command):
    """
    get the CDP neighbor detail from the given device using SSH

    :param ip: IP address of the device
    :param username: username used for the authentication
    :param password: password used for the authentication
    :param enable_secret: enable secret
    :return:
    """
    # establish a connection to the device
    ssh_connection = ConnectHandler(
        ip=ip,
        username=username,
        password=password
    )

    # enter enable mode
    #ssh_connection.enable()

    # prepend the command prompt to the result (used to identify the local host)
    result = ssh_connection.find_prompt() + "\n"

    # execute the show cdp neighbor detail command
    # we increase the delay_factor for this command, because it take some time if many devices are seen by CDP
    result += ssh_connection.send_command(command, delay_factor=2)

    # close SSH connection
    ssh_connection.disconnect()
    #print result
    return result
def perse_results(input,temp,outp):
    template = open(temp)
    re_table = textfsm.TextFSM(template)
    fsm_results = re_table.ParseText(input)
    # the results are written to a CSV file
    outfile_name = open("outfile.csv", "w+")
    outfile = outfile_name
    #print(re_table.header)
    print fsm_results
    header = []
    for s in re_table.header:
        outfile.write("%s;" % s)
        header.append(s)
    outfile.write("\n")
    counter = 0
    #output = []
    output = []
    for row in fsm_results:
        print(row)
        i = 0
        data = {}
        for s in row:
            outfile.write("%s;" % s)
            data[header[i]] = s
            i = i +1
        outfile.write("\n")
        counter += 1
        output.append(data)
    json_data = json.dumps(output)
    return output
    print("Write %d records" % counter)


'''result = run_command_cli('192.168.1.100','admin','admin')
#perse_results(result)
file = open('show_connected_int.txt','r')
#print file.read()
print 40*"-"
ok = perse_results(file.read(),"interfaces.textfsm",'vlans')
print ok
file.close()
'''